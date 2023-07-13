import _ from "lodash";
function SelectedPokemon(props) {

    const {slide, hide, pokeSelect, noPokemon, evolutionChain, pokemonSpecies} = props
    
    const hPokemonSelected = (pokemonId) => {
        props.hPokemonSelected(pokemonId)
    }

    return (
        <div id="current-pokemon-container" className= {"container column center "  + slide } style={hide ? {} : {display: "flex"}}>
            <img id="current-pokemon-image" src={ pokeSelect.sprites.versions["generation-v"]["black-white"].animated["front_default"] !== null ? pokeSelect.sprites.versions["generation-v"]["black-white"].animated["front_default"] : noPokemon } style={{height:"153px"}}/>
            {/* <!--Info--> */}
            <div id="current-pokemon-info">
                {/* <!--Id--> */}
                <span id="current-pokemon-id" className="font-size-12 bold">N° {pokeSelect.id} </span>
                
                {/* <!--name--> */}
                <h2 id="current-pokemon-name">{_.capitalize(pokeSelect.name)}</h2>

                {/* <!--types--> */}
                <div id="current-pokemon-types" className="row center">
                    <div className="row">
                        {pokeSelect.types.map((type) => {
                            return (
                                <div key={"poke-select-type"+pokeSelect.id+type.slot} className={`type-container type-color-${type.type.name}`}>
                                    {_.capitalize(type.type.name) }
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* <!--description--> */}
                <h4>Pokedex Entry</h4>
                <span id="current-pokemon-description">{pokemonSpecies}</span>

                {/* <!--height and weight--> */}
                <div className="row center">
                    <div className="width-100 column center margin-5">
                        <h4>Height</h4>
                        <div id="current-pokemon-height" className="pokemon-info-variable-container">{pokeSelect.height/10 + "m"}</div>
                    </div>
                    <div className="width-100 column center margin-5">
                        <h4>Weight</h4>
                        <div id="current-pokemon-weight" className="pokemon-info-variable-container">{pokeSelect.weight/10 + "kg"}</div>
                    </div>
                </div>

                {/* <!--abilities--> */}
                <div className="column">
                    <h4>Abilities</h4>
                    <div className="row">
                        {pokeSelect.abilities.map((ability) => {
                            return (
                                <div key={"ability" + pokeSelect.id+ability.slot} className="pokemon-info-variable-container">{_.capitalize(ability.ability.name)}</div>
                            )
                        })}
                    </div>
                </div>

                {/* <!--stats--> */}
                <h4>Stats</h4>
                <div className="row center">
                    <div className="current-pokemon-stats-container column">
                        <div className="current-pokemon-stats-name" style={{background: "#DF2140"}}>
                            HP
                        </div>
                        <h5 id="current-pokemon-stats-hp"> {pokeSelect.stats[0].base_stat} </h5>
                    </div>
                    <div className="current-pokemon-stats-container column">
                        <div className="current-pokemon-stats-name" style={{background: "#FF994D"}}>
                            ATK
                        </div>
                        <h5 id="current-pokemon-stats-atk">{pokeSelect.stats[1].base_stat}</h5>
                    </div>
                    <div className="current-pokemon-stats-container column">
                        <div className="current-pokemon-stats-name" style={{background: "#eecd3d"}}>
                            DEF
                        </div>
                        <h5 id="current-pokemon-stats-def">{pokeSelect.stats[2].base_stat}</h5>
                    </div>
                    <div className="current-pokemon-stats-container column">
                        <div className="current-pokemon-stats-name" style={{background: "#85DDFF"}}>
                            SpA
                        </div>
                        <h5 id="current-pokemon-stats-spa">{pokeSelect.stats[3].base_stat}</h5>
                    </div>
                    <div className="current-pokemon-stats-container column">
                        <div className="current-pokemon-stats-name" style={{background: "#96da83"}}>
                            SpD
                        </div>
                        <h5 id="current-pokemon-stats-spd">{pokeSelect.stats[4].base_stat}</h5>
                    </div>
                    <div className="current-pokemon-stats-container column">
                        <div className="current-pokemon-stats-name" style={{background: "#FB94A8"}}>
                            SPD
                        </div>
                        <h5 id="current-pokemon-stats-speed">{pokeSelect.stats[5].base_stat}</h5>
                    </div>
                    <div className="current-pokemon-stats-container column" style={{background: "#88AAEA"}}>
                        <div className="current-pokemon-stats-name" style={{background: "#7195DC"}}>
                            TOT
                        </div>
                        <h5 id="current-pokemon-stats-total">{pokeSelect.stats[0].base_stat + pokeSelect.stats[1].base_stat + pokeSelect.stats[2].base_stat + pokeSelect.stats[3].base_stat + pokeSelect.stats[4].base_stat + pokeSelect.stats[5].base_stat}</h5>
                    </div>
                </div>

                {/* <!--Evolution chain--> */}
                <div id="current-pokemon-evolution-chain-container">
                    <h4>Evolution</h4>
                    <div className="row evolution-center">
                        {evolutionChain.length > 0 && 
                            evolutionChain.map((eCItem,index) => {
                                return (
                                    <div key={"evolution-chain" + pokeSelect.id + eCItem.level + index} className='evolution-chain-container'>
                                        <img title={eCItem.name} className="current-pokemon-evolution-image" src={eCItem.img} onClick={()=> hPokemonSelected(eCItem.pokeId)}/>
                                        <div className="current-pokemon-evolution-level-container font-size-12 bold">{eCItem.level !== null ? "Lv. " + eCItem.level : "?"}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectedPokemon