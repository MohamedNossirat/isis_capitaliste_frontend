import React, {useEffect, useState} from 'react';
import "bulma/css/bulma.css";
import {gql, useQuery} from "@apollo/client";
import Main from "./components/Main";

const GET_WORLD = gql`
query GetWorld {
  getWorld {
    name
    logo
    money
    score
    totalangels
    activeangels
    angelbonus
    lastupdate
    products {
      id
      name
      logo
      cout
      croissance
      revenu
      vitesse
      quantite
      timeleft
      managerUnlocked
      paliers {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
    allunlocks {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
    upgrades {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
    angelupgrades {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
    managers {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
  }
}
`;


function App() {
    const [userName, setUserName] = useState(localStorage.getItem("username")||initializeUSername);
    const {data} = useQuery(GET_WORLD,
        {context: {headers: {"x-user": userName}}});

    //mettre à jour le username de joueur
    function onUserNameChanged() {
        // @ts-ignore
        let username = document.getElementById("userName").value
        if (!username || username!=""){
            setUserName(username);
            localStorage.setItem("username", username);
        }
    }

    function initializeUSername():string{
        localStorage.setItem("username", "Dentist"+Math.floor(Math.random()*1000))
        return "Dentist"+Math.floor(Math.random()*1000);
    }

    if(data === undefined) return (<div></div>);
    else {
        return (
                <section className="hero is-fullheight is-warning">
                    <div className="hero-head">
                        <nav className="navbar is-transparent">
                            <div className="navbar-menu">
                                <div className="navbar-end">
                                    <div className="navbar-item">
                                        <span className="pr-1"><strong>Joueur</strong></span>
                                        <input
                                            id="userName"
                                            type="text"
                                            value={userName}
                                            className="input is-info is-hoverable"
                                            onChange={onUserNameChanged}
                                        />
                                    </div>
                                </div>
                            </div>
                        </nav>
                        <div className="container is-fluid">
                            <Main loadworld={data.getWorld}/>
                        </div>
                    </div>
                    <div className="hero-foot">
                        <p className="has-text-centered pt-1 pb-1">🧡Pour Mathilde🧡</p>
                    </div>
                </section>
        );
    }
};

export default App;
