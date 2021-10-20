const bookList = document.getElementById(`bookList`);

let myLibrary = (!localStorage.getItem('localLibrary')) ? []
                : JSON.parse(localStorage.getItem('localLibrary'));

window.onload = () => {
    updateScreenLibrary();
    updateCounter();
}

starter();

function starter() {
    const addBookButton = document.querySelector(`[type="submit"]`);
    const clearData = document.getElementById('clearData');
    const cancelClear = document.getElementById('cancel');
    const confirmClear = document.getElementById('confirm');

    addBookButton.addEventListener('click', addBookToLibrary);
    clearData.addEventListener('click', toggle);
    cancelClear.addEventListener('click', toggle);
    confirmClear.addEventListener('click', clearPressed);
}

class Book {
    constructor(title, author, pages, readStatus) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readStatus = readStatus;
    }
}

function addBookToLibrary(e) {
    const book = getBookInfo(e);
    
    if(book) {
        myLibrary.push(book);
        updateScreenLibrary();
        updateCounter();
    }
}

function getBookInfo(e) {
    e.preventDefault();
    
    const titleInput = document.querySelector(`[placeholder="Title"]`);
    const authorInput = document.querySelector(`[placeholder="Author"]`);
    const pagesInput = document.querySelector(`[placeholder="Pages/Volumes"]`);
    const readCheckbox = document.querySelector(`[type="checkbox"]`);
    
    const form = document.querySelector('form');
    const titleReq = document.getElementById('forTitle');
    const authorReq = document.getElementById('forAuthor');
    const pagesReq = document.getElementById('forPages');
    
    if(titleInput.value === ``) titleReq.style.opacity = `1`;
    else titleReq.style.opacity = `0`;
    
    if(authorInput.value === ``) authorReq.style.opacity = `1`;
    else authorReq.style.opacity = `0`;
    
    if(pagesInput.value === ``) pagesReq.style.opacity = `1`;
    else pagesReq.style.opacity = `0`;
    
    if(titleInput.value && authorInput.value && pagesInput.value) {
        if(checkDuplicate(titleInput.value, authorInput.value)) {
            titleReq.textContent = `This book was added before!`
            titleReq.style.opacity = `1`;

        } else {
            titleReq.style.opacity = `0`;

            const book = new Book(titleInput.value, authorInput.value, pagesInput.value, readCheckbox.checked);
            form.reset();

            return book;
        }
    }
}

function checkDuplicate(title, author) {
    return myLibrary.some(book => book.title === title && book.author === author);
}

function updateScreenLibrary() {
    clearScreen();
    
    for(let book of myLibrary) 
    createBook(book);
}

function clearScreen() {
    bookList.innerHTML = ``;
    localStorage.setItem('localLibrary', JSON.stringify(myLibrary));
}

function createBook(bookFromLibrary) {
    const book = document.createElement('div');

    const bookStats = document.createElement('div');
    const title = document.createElement('h2');
    const author = document.createElement('h3');
    const pages = document.createElement('h4');

    const bookOptions = document.createElement('div');
    const status = document.createElement('p');
    const remover = document.createElement('i');

    book.classList.add('book');

    bookStats.classList.add('bookContent', 'bookInfo');
    title.textContent = `${bookFromLibrary.title}`;
    author.textContent = `- ${bookFromLibrary.author}`;
    pages.textContent = `${bookFromLibrary.pages} pages/volumes`;

    bookOptions.classList.add('bookContent');

    if(bookFromLibrary.readStatus) {
        status.textContent = 'R';
        status.classList.add('read');
    } else {
        status.textContent = 'UR';
        status.classList.add('unread');
    }

    status.addEventListener('click', statusUpdate);

    remover.classList.add('material-icons');
    remover.textContent = 'delete_forever';
    remover.addEventListener('click', removeBook);

    bookStats.append(title, author, pages);
    bookOptions.append(status, remover);
    book.append(bookStats, bookOptions);
    bookList.appendChild(book);
}

function statusUpdate(e) {
    const bookInfo = e.target.parentNode.parentNode.firstElementChild;
    const bookTitle = bookInfo.firstElementChild.textContent;
    const authorName = bookInfo.firstElementChild.nextElementSibling.textContent.replace(`- `, ``);

    const book = myLibrary.find(book => book.title === bookTitle && book.author === authorName);

    e.target.className = '';
    book.readStatus = !book.readStatus;

    if(e.target.textContent === 'R') {
        e.target.classList.add('unread');
        e.target.textContent = 'UR';
    } else {
        e.target.classList.add('read');
        e.target.textContent = 'R';
    }

    updateCounter();
}

function removeBook(e) {
    const bookInfo = e.target.parentNode.parentNode.firstElementChild;
    const bookTitle = bookInfo.firstElementChild.textContent;
    const authorName = bookInfo.firstElementChild.nextElementSibling.textContent.replace(`- `, ``);

    myLibrary = myLibrary.filter(book => !(book.title === bookTitle && book.author === authorName));

    updateScreenLibrary();
    updateCounter();
}

function toggle() {
    const clearPopup = document.getElementById('clearPopup');
    clearPopup.classList.toggle('active');
}

function clearPressed() {
    clearScreen();
    myLibrary = [];
    updateCounter();
    toggle();
}

function updateCounter() {
    const booksRead = document.getElementById('booksRead');
    const booksUnread = document.getElementById('booksUnread');

    let readCounter = 0,
        unreadCounter = 0;

    booksRead.textContent = `Books read: 0`;
    booksUnread.textContent = `Books unread: 0`;

    for(let book of myLibrary) {
        if(book.readStatus) {
            readCounter++;
            booksRead.textContent = `Books read: ${readCounter}`;
        } else {
            unreadCounter++;
            booksUnread.textContent = `Books unread: ${unreadCounter}`;
        }
    }

    localStorage.setItem('localLibrary', JSON.stringify(myLibrary));
}