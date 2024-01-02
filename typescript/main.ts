declare var Swal: any;

const cards = document.querySelectorAll(".card") as NodeListOf<Element>,
    timeTag = document.querySelector(".time b") as HTMLElement,
    flipsTag = document.querySelector(".flips b") as HTMLElement,
    refreshBtn = document.querySelector(".details button") as HTMLElement;



let maxTime: number = 60,
    timeLeft: number = maxTime,
    maxFlips: number = 40,
    flips: number = maxFlips,
    matchedCard: number = 0,
    flipResponse: boolean = true,
    isPlaying: boolean = false,
    cardOne: any, cardTwo: any, timer: number;


function initTimer(): void {
    timeLeft--;
    if (timeLeft > 0) {
        timeTag.innerText = `${timeLeft}`;
    } else {
        timeTag.innerText = `0`;
        gameOver();
    }
}
function decFlip(): void {
    flips--;
    if (flips > 0) {
        flipsTag.innerText = `${flips}`;
    } else {
        flipsTag.innerText = `${0}`;
        gameOver();
    }
}

function gameWon(): void {
    clearInterval(timer);

    Swal.fire({
        title: "Victory Achieved!",
        text:
            `
        Congratulations! You have emerged victorious in a time of ${maxTime - timeLeft} seconds with with only ${maxFlips - flips} flips. Give it another go, who knows, maybe you'll succeed with even fewer flips this time.  
        `,
        icon: "success",
        confirmButtonText: 'Try Again',
        allowOutsideClick: false,
    }).then((result: any) => {
        if (result.isConfirmed) {
            shuffleCard();
        }
    });
}

function gameOver(): void {
    clearInterval(timer);

    if (flips == 0) {
        Swal.fire({
            title: "Game Over!",
            text: `You've reached the maximum number of flips allowed, press Ok To Try Again! `,
            icon: "error",
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
        }).then((result: any) => {
            if (result.isConfirmed) {
                shuffleCard();
            }
        });
    } else if (timeLeft == 0) {
        Swal.fire({
            title: "Game Over!",
            text:  ` The time ran out, press Ok To Try Again! `,
            icon: "error",
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
        }).then((result: any) => {
            if (result.isConfirmed) {
                shuffleCard();
            }
        });
    }

}


function shuffleCard(): void {

    timeLeft = maxTime;
    flips = maxFlips;

    matchedCard = 0;
    cardOne = cardTwo = "";

    clearInterval(timer);

    timeTag.innerText = `${timeLeft}`;
    flipsTag.innerText = `${flips}`;

    isPlaying = false;
    flipResponse = true;

    let arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    cards.forEach((card, index) => {

        card.classList.remove("flip");

        let imgTag = card.querySelector(".back-view img") as HTMLImageElement;
        imgTag.src = `img/img-${arr[index]}.png`;

        card.addEventListener("click", flipCard);
    });
}


function flipCard(e: any): void {


    if (timeLeft > 0) {

        // one timer is start, it won't restart again on every key clicked
        if (!isPlaying) {
            timer = setInterval(initTimer, 1000);
            isPlaying = true;
            // console.log('You Start Now And Timer Is: ', timeLeft);
        }

        let clickedCard = e.target;


        if (clickedCard !== cardOne && flipResponse) {

            decFlip();

            clickedCard.classList.add("flip");

            if (!cardOne) {
                cardOne = clickedCard;
            } else {
                cardTwo = clickedCard;

                flipResponse = false;

                let cardOneImg: string = cardOne.querySelector(".back-view img").src,
                    cardTwoImg: string = cardTwo.querySelector(".back-view img").src;

                matchCards(cardOneImg, cardTwoImg);
            }

        }
    } else {
        gameOver();
    }
}

function matchCards(img1: string, img2: string): void {
    if (img1 === img2) {
        matchedCard++;
        if (matchedCard == 8 && timeLeft > 0) {
            gameWon();
        } else {
            cardOne.removeEventListener("click", flipCard);
            cardTwo.removeEventListener("click", flipCard);
            cardOne = cardTwo = "";
            flipResponse = true;
        }
    } else {
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 400);

        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            cardOne = cardTwo = "";
            flipResponse = true;
        }, 1200);
    }
}


refreshBtn.addEventListener("click", shuffleCard);
cards.forEach((card) => card.addEventListener("click", flipCard));

shuffleCard();