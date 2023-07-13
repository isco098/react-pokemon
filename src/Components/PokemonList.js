import { useEffect, useState } from 'react';
import EndPokemon from './EndPokemon';
import noPokemon from './../assets/images/no-pokemon-selected-image.png';
import pokemonBall from './../assets/images/pokeball-icon.png';
import closeIcon from './../assets/images/close-icon.png';
import ball from './../assets/images/ball.png';
import BackToTop from './BackToTop';
import axios from 'axios';
import _ from 'lodash';
import SelectedPokemon from './SelectedPokemon';
import NoPokemonSelected from './NoPokemonSelected';

function PokemonList() {
    const [pokeSelect, setPokeSelect] = useState({});
    const [slide, setSlide] = useState("");
    const [pokemon, setPokemon] = useState([]);
    const [evolutionChain, setEvolutionChain] = useState([]);
    const [pokemonSpecies, setPokemonSpecies] = useState("");
    const [typeOfPokemon, setTypeOfPokemon] = useState([]);
    const [page, setPage] = useState("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=30");
    const [hide, setHide] = useState("hide");
    const [isLoading, setIsLoading] = useState(false);
    const [bgClr, setBgClr] = useState("")
    const [btnScrollTop, setBtnScrollTop] = useState(false)

    const hPokemonSelected = async (pokemonId) => {
        if(window.innerWidth < 1100){
            document.getElementsByTagName('html')[0].style.overflow = 'hidden';

            await getDataPokeSelect(pokemonId);
            setSlide("slide-in");
        }else{
            setSlide("slide-out");

            setTimeout(async() => {
                await getDataPokeSelect(pokemonId);
                setSlide("slide-in");
            },300)
        }
    }
    const getDataPokeSelect = async (pokemonId) => {
        let dataRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);

        let dataPokemonSpecies = await getDataPokemonSpecies(dataRes.data.species.url);
        await getDataEvolutionChain(dataPokemonSpecies.evolution_chain.url);

        setPokeSelect(dataRes.data)
        setBgClr(dataRes.data.types[0].type.name)

    }
    const getDataPokemonSpecies = async (urlPokeSpecies) => {
        let dataRes = await axios.get(urlPokeSpecies);
        let pokeDes = dataRes.data.flavor_text_entries.find((item) => item.language.name === "en");
        setPokemonSpecies(pokeDes.flavor_text);
        return dataRes.data;
    }
    const getDataEvolutionChain = async (evolutionChainUrl) => {
        let dataRes = await axios.get(evolutionChainUrl);
        let dataEvolutionChain = dataRes.data.chain
        // _.isEmpty()
        let pokeEvolutionChain = handleDataEvolutionChain(dataEvolutionChain)
        setEvolutionChain(pokeEvolutionChain);
    }
    let arrPokeEvolutionChain = [];
    const handleDataEvolutionChain = (data) => {
        let pokemonId = data.species.url.split("/")
        pokemonId = pokemonId[pokemonId.length - 2]

        let pokeEvolution = {
            name: data.species.name,
            level: (data.evolution_details.length > 0) ? data.evolution_details[0].min_level : 1,
            pokeId: pokemonId,
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
        }
        arrPokeEvolutionChain.push(pokeEvolution)
        if(data.evolves_to.length > 0) {
            handleDataEvolutionChain(data.evolves_to[0]);
        }

        return arrPokeEvolutionChain;
    }

    useEffect(() => {
        const hScroll = async () => {

            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight && page && !isLoading) {
                console.log("get more pokemon")
                getPokemons(typeOfPokemon);
            }
                
            const scrollTop = document.documentElement.scrollTop;
            if (scrollTop > 250){
                setBtnScrollTop(true)
            } 
            else if (scrollTop <= 250){
                setBtnScrollTop(false)
            }
        }
        window.addEventListener('scroll', hScroll);

        return () => {
            window.removeEventListener('scroll', hScroll)
        }
    },[isLoading]);

    const updatePokemon = async (pokemonList , arrTypes) => {
        for(let i = 0; i < arrTypes.length; i++){
            let pokemonInType = arrTypes[i].pokemons

            for(let j = 0; j < pokemonInType.length; j++){
                let pokemonName = pokemonInType[j].pokemon.name
                pokemonList.forEach((item)=>{
                    if(!item.types){
                        item.types = [];
                    }
                    if(item.name === pokemonName){
                        item.types.push(arrTypes[i].nameType)
                    }
                })
            }
        }
        return pokemonList;
    }
    const getPokemons = async (arrTypes) => {
        setIsLoading(true)

        try{
            let getPokemonRes = await axios.get(page);
            let pokemonList = await (getPokemonRes && getPokemonRes.data && getPokemonRes.data.results) ? getPokemonRes.data.results : [];
            let nextPokemonList = getPokemonRes.data.next
            setPage(nextPokemonList);
            console.log(nextPokemonList);
            if(arrTypes.length > 0){
                let pokemonListUpdate =  await updatePokemon(pokemonList, arrTypes);
                let newPokemonList = [...pokemon,...pokemonListUpdate]
                setPokemon(newPokemonList);
            }
        }
        catch(e){

        }
        finally{
            setIsLoading(false)
        }
    }
    const getTypes = async () => {
        let arrTypes = [];
        let allType = await axios.get("https://pokeapi.co/api/v2/type/");
        
        allType.data.results.forEach(async (itemType) => {
            let types = await axios.get(itemType.url);
            if(types.data.pokemon.length > 0){
                arrTypes.push({
                    type: types.data.id,
                    nameType: itemType.name,
                    pokemons: types.data.pokemon
                });
            }
        });
        setTypeOfPokemon(arrTypes)
        return arrTypes;
    }

    const combinePokemonType = async () => {
        let arrTypes = await getTypes();
        await getPokemons(arrTypes);
    }
    
    useEffect(() => {
        combinePokemonType()
    },[]);

    useEffect(() => {
        setHide("")
    },[pokeSelect])

    const hClosePokemon = () => {
        setSlide("slide-out");
        document.getElementsByTagName('html')[0].style.overflow = 'unset';
        setTimeout(()=> {
            setHide("hide");
            setSlide("");
        },350)
    }

    const imageOnError = (event) => {
        event.currentTarget.src = ball;
        // event.currentTarget.className = "error";
      };

  return (
    <div className="row" >
        {/* <!--Setup Loading Div--> */}
        { pokemon.length === 0 &&
            <div id="loading-div">
                <div className="pokemon-ball"></div> 
            </div> 
        }

        {/* <!--Search Bar and render search pokemon--> */}        
        <div id="pokedex-list" className="column" >
            {/* <!--Search Bar--> */}
            <div id="search-bar-container" className="row container margin-40">
                {/* <input id="search-input" onkeydown="search()" placeholder="Search your Pokemon"/> */}
                <input id="search-input" placeholder="Search your Pokemon"/>
                <div id="start-search-button" className="center">
                    <i className="fas fa-search"></i>
                </div>
            </div>

            <div id="pokedex-list-render-container">
                {/* <!--Render here--> */}
                {
                    pokemon.length > 0 && 
                    pokemon.map((item) => {
                        let name = _.capitalize(item.name)
                        let pokemonId = item.url.split("/")
                        pokemonId = pokemonId[pokemonId.length - 2]
                        let pokemonUrl = item.url
                        return (
                            <div key={"pokemon-id"+pokemonId} className="pokemon-render-result-container container center column pokemon" onClick={()=> hPokemonSelected(pokemonId)}>
                                <img className="search-pokemon-image" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}  onError={(e)=>imageOnError(e)}/>
                                <span className="bold font-size-12">N° {pokemonId}</span>
                                <h3>{name}</h3>
                                <div className="row">
                                    {item.types.map((type,index) => {
                                        return (
                                            <div key={"type"+pokemonId+type+index} className={`type-container type-color-${type}`}>
                                                {_.capitalize(type) }
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {!page &&
                <EndPokemon />
            }
            { isLoading &&
                <div className='row'>
                    <div className="pokemon-ball-small"></div>
                </div>
            }
        </div>
        
        {/* <!--responsive current pokemon--> */}
        {   !hide && !_.isEmpty(pokeSelect) &&
            <>
                <div id="current-pokemon-responsive-background" className={`type-color-${bgClr}`} style={{opacity: 0.7}}></div>
                <div onClick={()=> hClosePokemon()} id="current-pokemon-responsive-close" className="" ><img src={ closeIcon } /></div>
            </>
        }
        

        {/* <!--current selected pokemon--> */}
        {  !_.isEmpty(pokeSelect) ?
            <SelectedPokemon 
                slide={slide}
                hide={hide}
                pokeSelect={pokeSelect}
                noPokemon={noPokemon}
                evolutionChain={evolutionChain}
                hPokemonSelected={hPokemonSelected}
                pokemonSpecies={pokemonSpecies}
            />
        : 
            <NoPokemonSelected
                slide={slide}
                noPokemon={noPokemon}
            />
        }
        
        {/* <!--Back to top button--> */}
        <BackToTop 
            btnScrollTop={btnScrollTop}
        />

        {/* <!--Loading selected pokemon--> */}
        <img id="current-pokemon-loading" src={pokemonBall} className="loading-ball"/>
    </div>
  );
}

export default PokemonList