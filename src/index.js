import "./style.css";

class DadataSuggest {
    constructor(el, token) {
        this.token = token || '03689b817a66cdc9e0e0bed70f6121150b07e51e';
        
        this.input = document.querySelector(el);
        this.input.addEventListener('input', this.onInput.bind(this) );
        this.input.addEventListener('blur', this.hideSuggestionsList.bind(this) );
        this.input.addEventListener('focus', this.showSuggestionsList.bind(this) );
        
        //контейнер для dropdown подсказок
        this.suggestListContainer = document.createElement('ul');
        this.suggestListContainer.classList.add('dadata__suggest-list');
        this.suggestListContainer.addEventListener('click', this.selectSuggestion.bind(this) );
        
        //кнопка очистки input и лоадер
        this.inputClearButton = document.createElement('span');
        this.inputClearButton.classList.add('dadata__input-button');
        this.input.parentNode.insertBefore(this.inputClearButton, this.input.nextSibling);
        this.inputClearButton.addEventListener('click', this.clearInput.bind(this) );
        
        
        this.api = this.input.getAttribute('dadata-type'); //тип подсказок, адрес, фио и тп.
    }

    client (params) {
        return fetch( `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/${this.api}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Token ${this.token}`,
                },
                body: JSON.stringify(params),
            }
        )
        .then(res => res.json());
    }

    onInput(event) {

        this.inputClearButton.classList.add('dadata__input-button_loading');

        if (this.inputTimer){
            window.clearTimeout(this.inputTimer);
        }
    
        this.inputTimer = setTimeout( () => { this.search.call(this, event.target.value); }, 500);

    }
    
    search(query) {
        this.client({ query: query, count: 5})
            .then(res=>{
                this.renderSuggestionsList(res.suggestions);
            });
    }

    renderSuggestionsList (suggestions) {

        if (suggestions.length) {
            this.clearSuggestList();
    
            const suggestList = document.createDocumentFragment();
    
            for (let i = 0; i < suggestions.length; i++) {
                const suggestListItem = document.createElement('li');
                suggestListItem.classList.add('dadata__suggest-list-item')
                suggestListItem.textContent = suggestions[i].value;
                suggestList.append(suggestListItem);
            }
    
            this.suggestListContainer.append(suggestList);
            this.input.parentNode.insertBefore(this.suggestListContainer, this.inputClearButton.nextSibling);
            this.showSuggestionsList ();
        }

        this.inputClearButton.classList.remove('dadata__input-button_loading');
    }

    hideSuggestionsList () {
        setTimeout( () => { this.suggestListContainer.style.display = 'none'; }, 200); //чтобы поймать клик по списку
    }

    showSuggestionsList () {
        if (this.suggestListContainer.hasChildNodes()) this.suggestListContainer.style.display = 'inline-block';
    }
    
    clearSuggestList () {
        while (this.suggestListContainer.hasChildNodes()) {
            this.suggestListContainer.removeChild(this.suggestListContainer.lastChild);
        }
    }
  
    selectSuggestion(event) {
        this.input.value = event.target.innerText;
    }

    clearInput() {
        this.input.value = '';
        this.clearSuggestList();
    }
}

const dadataAdress = new DadataSuggest ('#address');
