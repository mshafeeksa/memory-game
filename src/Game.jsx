import { useState, useEffect } from "react";
import Card from "./card";
import "./styles/Game.css";
import LoadingImage from "./assets/loading.svg"
export default function Game() {
    const [cardList, setCardList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const [score, setScore] = useState(0);
    updateScore(score);
    const maxCardCount = 12;
    let loadedImages = 0;
    useEffect(() => {
        async function getData() {
            const idList = generateRandomArray(maxCardCount, 100,1);
            Promise.all(idList.map(async (id) => await fetchData(id)))
                .then((value) => {
                    console.log(value);
                    setCardList(assignCardList(value));
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(()=> setIsLoading(false))
        }
        getData();
        setBestScore(maxCardCount);
    }, []);

    useEffect(() => {
        if (cardList !== null){
            const newCardList = shuffleCardList(cardList);
            setCardList(newCardList);
        }
    },[score])

    function incrementLoadCounter() {
        loadedImages++;
        if (loadedImages === maxCardCount) {
            setIsLoadingComplete(true);
        }
    }


    return (
        <>
            <div className={`main-container ${(!isLoadingComplete) && "hide"}`} id="main-container">
            {
                isLoading? <div className="loading-text">Loading..</div> : cardList && cardList.map((card) => {
                    return (
                        <div className="card" onClick={()=>{handleCardClick(card)}} key={card.id}>
                            <img src={card.image} alt={card.name} className="poke-image" onLoad={incrementLoadCounter}/>
                            <div className="poke-name">{card.name}</div>
                        </div>
                    );
                })              
            }
            </div>
            {!isLoadingComplete && <LoadingScreen />}
        </>
    );
    function handleCardClick(card) {
        if (card.checkStatus()) {
            runGameOver("game-over");
        }
        else {
            card.setClick();
            setScore(score + 1);
            updateScore(score);
            if (score + 1 === maxCardCount) {
                runGameOver("player-won");
            }
        }
    }

    function shuffleCardList(cardList) {
        const newTemplateArray = generateRandomArray(maxCardCount, maxCardCount,0);
        let newArray = [];
        newTemplateArray.forEach((element,index) => {
            newArray[index] = cardList[element];
        })
        return newArray;
    }

}

function LoadingScreen() {
    return (
        <div className="loading-screen">
            <img src={LoadingImage} alt="Loading.." className="loading-image" />
        </div>
    );
}

function setBestScore(score) {
    document.querySelector("#best-score").textContent = score;
}
function updateScore(score) {
    document.querySelector("#current-score").textContent = score;
}

function runGameOver(classSelector) {
    document.querySelector(`.${classSelector}`).classList.remove("hide");
    document.querySelector(".main-container").classList.add("hide");
    console.log("Game over");
}

async function fetchData(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    try {
        const response = await fetch(url);
        const responseObject = await response.json();
        return responseObject;
    } catch (error) {
        console.log(error);
    }
}

const generateRandomArray = (length, max, start) => {
    let isArrayReady = false;
    let finalArray = [];
    while (!isArrayReady) {
        let number = generateRandomNumber(max,start);
        if (!(finalArray.includes(number))) {
            finalArray.push(number);
            finalArray.length >= length ? isArrayReady = true : isArrayReady = false;
        }
    }
    return finalArray;
}

const generateRandomNumber = (max, start) => {
    return (Math.floor(Math.random() * max))+start;
}

function assignCardList(value) {
    let finalCardList = [];
    value.map((pokeObjects) => {
        finalCardList.push(new Card(pokeObjects.id, pokeObjects.name, pokeObjects.sprites.other.dream_world.front_default));
    });
    return finalCardList;
}