package main

import (
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"math"
	"sync"
	"log"
	"runtime"
	"net"
)

// Contains the structure that will hold the goroutined rows
type ConvolveResult struct {
	Result [][]float64
	Index  int
}

// Sobel Filter Arrays
var sobelX = [][]float64{
	{-1, 0, 1},
	{-2, 0, 2},
	{-1, 0, 1},
}
var sobelY = [][]float64{
	{-1, -2, -1},
	{0, 0, 0},
	{1, 2, 1},
}


/*	ConvertToGrayscale 
Function: converts the image to a black and white one removing colors
Parameters: img        -> image object to be gray scaled
			numWorkers -> number of goroutines that will be used
*/
func ConvertToGrayscale(img image.Image, numWorkers int) *image.Gray {
	bounds := img.Bounds()
	gray := image.NewGray(bounds)

	var wg sync.WaitGroup
	rowsPerWorker := (bounds.Max.Y - bounds.Min.Y) / numWorkers

	for workerID := 0; workerID < numWorkers; workerID++ {
		startRow := bounds.Min.Y + workerID*rowsPerWorker
		endRow := startRow + rowsPerWorker

		// Ensures that the last worker processes remaining rows
		if workerID == numWorkers-1 {
			endRow = bounds.Max.Y
		}


		wg.Add(1)
		go func(startRow, endRow int) {
			defer wg.Done()
			for x := bounds.Min.X; x < bounds.Max.X; x++ {
				for y := startRow; y < endRow && y < bounds.Max.Y; y++ {
					// Takes the pixel at x,y coord and changes its intensity
					gray.Set(x, y, img.At(x, y))
				}
			}
		}(startRow, endRow)
	}

	wg.Wait()

	return gray
}


/*	ImageToFloat64Array
Function: converts an image to a 2D float64 array
Parameters: img -> image object
			numWorkers -> number of goroutines that will be used
*/
func ImageToFloat64Array(img image.Image, numWorkers int) [][]float64 {
	bounds := img.Bounds()

	// Creates an empty 2d array of type float64 to put the image individual pixels into
	imageData := make([][]float64, bounds.Max.Y)

	var wg sync.WaitGroup
	rowsPerWorker := (bounds.Max.Y - bounds.Min.Y) / numWorkers

	for workerID := 0; workerID < numWorkers; workerID++ {
		startRow := bounds.Min.Y + workerID*rowsPerWorker
		endRow := startRow + rowsPerWorker

		// Ensures that the last worker processes remaining rows
		if workerID == numWorkers-1 {
			endRow = bounds.Max.Y
		}

		wg.Add(1)
		go func(startRow, endRow int) {
			defer wg.Done()

			for y := startRow; y < endRow; y++ {
				imageData[y] = make([]float64, bounds.Max.X)
				for x := 0; x < bounds.Max.X; x++ {
					// Because image is gray scaled all values are the same so we take the first one which is r
					r, _, _, _ := img.At(x, y).RGBA()
					// Converts the r rgb value into a float64 and makes it in the range of [0,1]
					imageData[y][x] = float64(r) / 65535.0
				}
			}
		}(startRow, endRow)

	}

	wg.Wait()

	return imageData
}


/*	ConvolveImage
Function: performs convolution using the sobel filter to create an edge filtered image
Parameters: image      -> the 2d array that is going to be treated
			filter     -> the sobel filter that is going to be used
			numWorkers -> number of goroutines
*/
func ConvolveImage(image [][]float64, filter [][]float64, numWorkers int) [][]float64 {
	height := len(image)
	width := len(image[0])
	fHeight := len(filter)
	fWidth := len(filter[0])
	

	padHeight := fHeight / 2
	padWidth := fWidth / 2
	//Create a bigger padded image to not have weird effects on the edge of the image
	paddedImage := make([][]float64, height+2*padHeight)
	for i := range paddedImage {
		paddedImage[i] = make([]float64, width+2*padWidth)
	}
	//Pad the image with zeros
	for i := 0; i < height; i++ {
		for j := 0; j < width; j++ {
			paddedImage[i+padHeight][j+padWidth] = image[i][j]
		}
	}


	//Initialize the result image
	result := make([][]float64, height)
	for i := range result {
		result[i] = make([]float64, width)
	}


	//Make a channel to hold all goroutines results
	var wg sync.WaitGroup
	resultCh := make(chan ConvolveResult, height)
	rowsPerWorker := height / numWorkers


	for workerID := 0; workerID < numWorkers; workerID++ {

		startRow := workerID*rowsPerWorker
		endRow := startRow + rowsPerWorker

		//Ensures that the last worker processes remaining rows
		if workerID == numWorkers-1 {
			endRow = height
		}

		//To not have a warning for using the loop literal inside a function
		index := workerID

		wg.Add(1)
		//Convolution magic 
		go func(startRow, endRow int) {
			defer wg.Done()

			for i := startRow; i < endRow; i++ {
				for j := 0; j < width; j++ {
					sum := 0.0
					for ii := 0; ii < fHeight; ii++ {
						for jj := 0; jj < fWidth; jj++ {
							sum += paddedImage[i+ii][j+jj] * filter[ii][jj]
						}
					}
					result[i][j] = sum
				}
			}

			//Adds the result to the channel
			resultCh <- ConvolveResult{Result: result[startRow:endRow], Index: index}
		}(startRow, endRow)
	}

	wg.Wait()
	close(resultCh)


	//Combine all results
	for convResult := range resultCh {
		startRow := convResult.Index * rowsPerWorker
		copy(result[startRow:], convResult.Result)
	}

	return result
}


/*	CombineAndNormalize
Function: combine the two arrays and then normalizes their value to the range of [0,255]
Parameters: gradientX -> the 2d array containing the convolued image with SobelX array
		 	gradientY -> the 2d array containing the convolued image with SobelY array
*/
func CombineAndNormalize(gradientX, gradientY [][]float64) [][]float64{

	// Create a new array that will contain the combined values
	edges := make([][]float64, len(gradientX))
	for i := range edges {
		edges[i] = make([]float64, len(gradientX[0]))
	}

	for i := 0; i < len(gradientX); i++ {
		for j := 0; j < len(gradientX[0]); j++ {
			edges[i][j] = math.Sqrt(gradientX[i][j]*gradientX[i][j] + gradientY[i][j]*gradientY[i][j])
		}
	}

	// Normalize the pixel values to the range of [0, 255]
	minValue := edges[0][0]
	maxValue := edges[0][0]
	for i := 0; i < len(edges); i++ {
		for j := 0; j < len(edges[0]); j++ {
			if edges[i][j] < minValue {
				minValue = edges[i][j]
			}
			if edges[i][j] > maxValue {
				maxValue = edges[i][j]
			}
		}
	}

	for i := 0; i < len(edges); i++ {
		for j := 0; j < len(edges[0]); j++ {
			edges[i][j] = 255 * (edges[i][j] - minValue) / (maxValue - minValue)
		}
	}

	return edges
}


/*	Float64ArrayToImage
Function: converts the 2d array into an image
Parameters: data        -> 2d array containing the normalized pixel intensities
			numWorkers  -> number of goroutines
*/
func Float64ArrayToImage(data [][]float64, numWorkers int) *image.Gray {
	height := len(data)
	width := len(data[0])

	gray := image.NewGray(image.Rect(0, 0, width, height))
	var wg sync.WaitGroup

	rowsPerWorker := height / numWorkers

	for workerID := 0; workerID < numWorkers; workerID++ {
		startRow := workerID*rowsPerWorker
		endRow := startRow + rowsPerWorker

		//Ensures that the last worker processes remaining rows
		if workerID == numWorkers-1 {
			endRow = height
		}

		wg.Add(1)
		go func(startRow, endRow int) {
			defer wg.Done()
			for y := startRow; y < endRow; y++ {
				for x := 0; x < width; x++ {
					//Gives the intensity number to each pixel
					gray.SetGray(x, y, color.Gray{uint8(data[y][x])})
				}
			}
		}(startRow, endRow)
	}

	wg.Wait()

	return gray
}

/*	HandleClient
Function: handles each client in a separate goroutine
Parameters: conn       -> the connection object for the client
			numWorkers -> number of goroutines
*/
func HandleClient(conn net.Conn, numWorkers int) {
	defer conn.Close()

	//Decodes the encoded image sent
	img, err := jpeg.Decode(conn)
	if err != nil {
		fmt.Println("Error decoding image:", err)
		return
	}

	//Converts the image to grayscale
	img = ConvertToGrayscale(img,numWorkers)

	//Converts the grayscale image to a 2D float64 array
	imageData := ImageToFloat64Array(img,numWorkers)

	//Perform convolution for both X and Y directions using goroutines
	gradientX := ConvolveImage(imageData, sobelX, numWorkers)
	gradientY := ConvolveImage(imageData, sobelY, numWorkers)	

	//Combine the results and normalizes to get the final edge-detected image
	edges := CombineAndNormalize(gradientX, gradientY)

	//Convert the 2D float64 array back to a grayscale image
	edgeImg := Float64ArrayToImage(edges,numWorkers)

	//Send the filtered image back to the client
	err = jpeg.Encode(conn, edgeImg, nil)
	if err != nil {
		log.Println("Error encoding filtered image:", err)
		return
	}

}


func main() {

	//Number of goroutines depends on the PC
	numWorkers := runtime.NumCPU()
	
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatal("Error starting server:", err)
	}
	defer listener.Close()
	
	fmt.Println("Serveur en attente de connexions...")

	//Infinite loop waiting to accept connexions and handle them in different goroutines
	for {
		conn, err := listener.Accept()
			if err != nil {
				log.Println("Error accepting connection:", err)
				continue
			}
		go HandleClient(conn,numWorkers)
	}
}