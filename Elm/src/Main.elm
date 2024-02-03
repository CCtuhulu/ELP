module Main exposing(..)

import Browser
import Http
import Html exposing (..)
import Html.Events exposing (onInput,onClick)
import Html.Attributes exposing (..)
import Random
import Json.Decode as Decode exposing  (..)
import Time 



------------------------MAIN------------------------


main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }

------------------------MODEL------------------------

type alias Model =
  { def_list : WordDefinitions
  , word_list : List String
  , selectedWord : String
  , state : State 
  , guessed : String
  , load : String
  , newLoad : String
  , definition_nb : Int
  , correct : Bool
  , elapsedTime : Int
  }
type State
  = Failure
  | Loading
  | Success

------------------------TYPES------------------------

type alias WordDefinition =
  {
    word : String
  , meanings : List Meaning
  }

type alias Definitions = 
  {
    definition : String 
  }

type alias Meaning = 
  {
    partOfSpeech : String 
  , definitions : List Definitions
  }

type alias WordDefinitions = List WordDefinition 
type alias Meanings = List Meaning
type alias ListDefinitions = List Definitions

type Msg
  = GotWord (Result Http.Error String)
  | Random_nb Int 
  | GotDefinition (Result Http.Error WordDefinitions)
  | ShowWord
  | Change String
  | AddDef 
  | Next
  | Tick Time.Posix

----------------------DECODERS----------------------

recupereJson : Decode.Decoder WordDefinitions
recupereJson = 
  Decode.list wordDecoder

wordDecoder : Decode.Decoder WordDefinition
wordDecoder =
  Decode.map2 WordDefinition
    (Decode.field "word" Decode.string )
    (Decode.field "meanings" <| Decode.list meaningsDecoder)


meaningsDecoder : Decode.Decoder Meaning
meaningsDecoder = 
  Decode.map2 Meaning 
    (Decode.field "partOfSpeech" Decode.string)
    (Decode.field "definitions" <| Decode.list definitionsDecoder)

definitionsDecoder : Decode.Decoder Definitions
definitionsDecoder = 
  Decode.map Definitions
    (Decode.field "definition" Decode.string) 

---------------------GETTING WORD-----------------------

init : () -> (Model, Cmd Msg)
init _ =
    ( Model [] [] "" Loading  "" "" "" 1 False 0
    , Http.get
        { url = "http://localhost:8000/resources/words.txt"
        , expect = Http.expectString GotWord
        }
    )


-------------------------UPDATE-------------------------
update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of

    -- Check if the word list has been successfully retrieved
    GotWord (Ok text) ->
      ({
        model | word_list = String.split " " text
      }
      ,
        Random.generate Random_nb (Random.int 0 999)
      )

    -- Catches not getting word list error
    GotWord(Err _) ->
      ({model| state = Failure}
      , Cmd.none
      )

    -- Chooses a random word from the list
    Random_nb nb->
      let mot=Maybe.withDefault " " (List.head (List.drop nb model.word_list))
      in ({
        model|selectedWord=mot}, Http.get
          { url = ("https://api.dictionaryapi.dev/api/v2/entries/en/"++mot)
          , expect = Http.expectJson GotDefinition recupereJson
          })
      
    -- Make a list of definitions of the choosen word
    GotDefinition def ->
      case def of
        Ok define -> 
          ({
            model | def_list = define , state = Success
          }
          , Cmd.none)

        Err _ ->
          ({
            model| state = Failure
          }
          , Cmd.none)

    -- Show the word when player clicks on the button
    ShowWord ->
      let guess=model.selectedWord
      in ({model|guessed=guess}, Cmd.none)
    
    -- Add more definitions on th player demand
    AddDef ->
      ({model|definition_nb = model.definition_nb + 1}, Cmd.none)

    -- Check ifthe player guessed the word and notices him while not letting him input anything anymore
    Change message-> 
      if String.toLower message == String.toLower model.selectedWord then
      ({model|load=message, newLoad ="Congratulations ! You guessed the word in "++ String.fromInt (model.elapsedTime) ++ " seconds!!", correct = True}, Cmd.none)
      else
      ({model|load=message, newLoad ="Congratulations ! You guessed the word in "++ String.fromInt (model.elapsedTime) ++ " seconds!!"}, Cmd.none)
    
    -- Skip to next word
    Next -> 
      let
        updatedModel = { model | guessed = "", load = "", definition_nb = 1 , correct = False, elapsedTime = 0}
        randomCmd = Random.generate Random_nb (Random.int 0 999)
      in
        (updatedModel, randomCmd)

    -- Calculate the elapsed time since starting to guess the new word
    Tick newTime ->
        ( { model | elapsedTime = model.elapsedTime + 1 }, Cmd.none)
     
---------------------SUBSCRIPTIONS---------------------

subscriptions : Model -> Sub Msg
subscriptions model =
  Time.every 1000 Tick

-------------------------VIEW--------------------------

-- Does most of display part depending on the state
view : Model -> Html Msg
view model =
  case model.state of

    Failure ->
      div[][
        text ("Unable to load your page.")
      ]

    Loading ->
      text "Loading..."

    Success -> 
      div [ style "display" "flex"
          , style "flex-direction" "column"
          , style "align-items" "center"
          , style "justify-content" "space-evenly"
          , style "gap" "1vh"
          , style "background-color" "lightcoral"
          , style "width" "fit-content"
          , style "min-width" "30vw"
          , style "max-width" "75vw"
          , style "margin" "auto"
          , style "margin-top" "5vh"
          , style "margin-bottom" "5vh"
          , style "box-shadow" "4px 4px 2px black"
          , style "padding" "20px"
          , style "font-family" "arial"
          ] [
        h1 [ style "margin" "0" ] [text "Guess the word!"],
        h3 [ style "margin" "0" ] [text "Try to guess the word below based on its definition"],
        div[ style "color" "black", style "font-size" "large",  style "font-family" "auto" ] [ ul [] (List.concatMap (\wordDef -> List.map (\meaning -> viewMeaning meaning model) wordDef.meanings) model.def_list) ],
        div [ style "font-size" "large" ] [button [ onClick (AddDef)] [ text "Add more definitions" ]],
        div [ style "text-transform" "capitalize", style "font-size" "large", style "font-family" "auto" ] [text (model.guessed)],
        div [ style "display" "flex"
            , style "flex-direction" "column"
            , style "justify-content" "center"
            ]
          [ 
            if not model.correct then
            input [ placeholder "Guess the word!", Html.Attributes.value model.load, onInput Change, style "width" "30%", style "margin" "auto", style "margin-bottom" "10px", style "min-width" "100px"] []
            else
            div[ style "text-align" "center" , style "margin-bottom" "10px", style "text-transform" "capitalize"] [text model.selectedWord]
          ,
            if String.isEmpty model.load then
            div [ style "font-size" "large" ] [ text ( "Input Your guess!") ]
            else if String.toLower model.load==String.toLower model.selectedWord then 
            div [ style "font-size" "large" ] [ text ( model.newLoad) ]
            else 
            div [ style "font-size" "large" ] [ text "You didn't guess the word, try again or skip to the next one" ]
          ],
          div [ style "display" "flex", style "gap" "20px" ] [
            div [ style "font-size" "large" ] [button [ onClick (ShowWord)] [ text "Show answer" ]],
            div [ style "font-size" "large" ] [button [ onClick (Next)] [ text "Get a new word" ]]
          ]
        ]  

-- Formatting for the part of speech part
viewMeaning : Meaning -> Model -> Html msg
viewMeaning meaning model=
    li [ style "font-weight" "bold" 
     , style "text-transform" "capitalize"
     , style "padding" "5px"
     ]
    [text (meaning.partOfSpeech)
    ,ul [ style "font-weight" "normal" 
        , style "text-transform" "none"
        , style "list-style" "arabic"
        ] 
        (List.map viewDefinition (List.take model.definition_nb meaning.definitions))
    ]

-- Formatting for the definitions
viewDefinition : Definitions -> Html msg
viewDefinition definition =
    li [] 
         [div [ style "font-style" "italic" 
              , style "padding-left" "5px" 
              ] [text (definition.definition)]
         ]



