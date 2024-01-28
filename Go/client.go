package main

import (
	"fmt"
	"image/jpeg"
	"image"
	"net"
	"os"
	"log"
	"time"
)



/*	LoadImage
Function: loads the image that is going to be treated by the edge detection filter
Parameters: filename -> name of the image 
*/
func LoadImage(filename string) (image.Image) {
	
	// Load the image
	file, err := os.Open(filename)
	if err != nil {
		log.Fatal("Error loading image:", err)
	}
	defer file.Close()

	// Decode the image so it can be treated
	img, _, err := image.Decode(file)
	if err != nil {
		log.Fatal("Error decoding image:", err)
	}

	return img
}


/*	SendImage
Function: sends the image to the server
Parameters: conn       -> the connection object
			img        -> the image object
*/
func SendImage(conn net.Conn, img image.Image) {

	// Send image data to the server
	err := jpeg.Encode(conn, img, nil)

	if err != nil {
		fmt.Println("Error sending image:", err)
	}
}


/*	ReceiveImage
Function: sends the image to the server
Parameters: conn       -> the connection object
*/
func ReceiveImage(conn net.Conn) (image.Image) {
	
	receivedImg, _, err := image.Decode(conn)
	
	if err != nil {
		log.Fatal("Error receiving image:", err)
	}

	return receivedImg
}


/*	SaveImage
Function: saves the generated edge detected image to the directory
Parameters: filename -> name of the image in the directory
			img      -> image object
*/
func SaveImage(filename string, img image.Image) {
	file, err := os.Create(filename)
	if err != nil {
		log.Fatal("Error saving image:", err)
	}
	defer file.Close()

	err = jpeg.Encode(file, img, nil)
	if err != nil {
		log.Fatal("Error encoding image:", err)
	}
}


func main() {

	filename := os.Args[1]

	conn, err := net.Dial("tcp", "localhost:8080")
	if err != nil {
		fmt.Println("Error connecting to server:", err)
		return
	}
	defer conn.Close()

	img := LoadImage("Images Folder/"+filename+".jpg")

	SendImage(conn, img)

	fmt.Println("Image sent successfully")


	startTime := time.Now()

	receivedImg := ReceiveImage(conn)

	//Save the edge detected image 
	SaveImage("Edge Filtered Images/"+filename+"_edge_detected.jpg", receivedImg)

	endTime := time.Now()
	fmt.Println("Filtered image received successfully and saved in the Edge Filtered Images folder en: %s", endTime.Sub(startTime))

}