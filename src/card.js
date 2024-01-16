class Card{
    constructor(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.isClicked = false;
    }

    setClick() {
        this.isClicked = true;
    }

    checkStatus() {
        return this.isClicked;
    }
}

export default Card;