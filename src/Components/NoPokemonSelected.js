import React from 'react'

function NoPokemonSelected(props) {
    const {slide, noPokemon} = props
    return (
        <div id="current-pokemon-container" className= {"container column center " + slide }>
            <img id="current-pokemon-image" src={ noPokemon } /> 

            {/* <!--Empty--> */}
            <div id="current-pokemon-empty">
                <span className="font-size-18">Select a Pokemon<br/>to display here.</span>
            </div>
        </div>
    )
}

export default NoPokemonSelected