import React from "react";
import {Palier, World} from "../../world";
import globaux from "../globals";

type ManagersProps = {
    managers : Palier[]
    showManager: boolean
    hideManager :(c:boolean)=>void
    world:World
    hireManager:(manager:Palier)=>void
}
const Managers = ({showManager, hideManager, managers, world, hireManager}: ManagersProps) => {
    let className: string = "";
    if (!showManager) return (<div></div>);
    else {
        className = " modal is-active";
        return (<div className={className}>
            <div className="modal-background"></div>
            <div className="modal-content" style={{
                top:"7%",
                bottom:"20%",
                width:"95%",
                height:"100%"
            }}>
                <div><div className="box" >
                    <div className="columns is-multiline is-vcentered">
                    {
                        managers.filter(manager=>!manager.unlocked).map((manager, index) =>
                            <div className="column is-2" key={index}>
                                <p className="subtitle has-text-centered">Dr: {manager.name}</p>
                                <p className="heading">Expert en :{world.products[manager.idcible-1].name}</p>
                                <img src={globaux.server_url+manager.logo}/>
                                <button
                                    disabled={world.money<manager.seuil}
                                    className=" button is-primary button-53"
                                    onClick={(e)=>{hireManager(manager); hideManager(false)}}>
                                    Hire {manager.seuil}€
                                </button>
                            </div>
                        )
                    }
                    </div>
                </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close"
                    onClick={(e)=>hideManager(false)}/>
        </div>);
    }
};

export default Managers;