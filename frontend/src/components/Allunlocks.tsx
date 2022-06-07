import React from "react";
import { Palier, World } from "../../world";
import globaux from "../globals";

type UnlocksProps = {
    allunlocks : Palier[]
    showUnlocks: boolean
    hideUnlocks :(c:boolean)=>void
    world:World
    useUnlock:(unlock:Palier)=>void
}

const allunlocks = ({allunlocks,showUnlocks,hideUnlocks,world, useUnlock}:UnlocksProps) =>{
    let className: string = "";
    if (!showUnlocks) return (<div></div>);
    else {
        className = " modal is-active";
        return (<div className={className}>
            <div className="modal-background"/>
            <div className="modal-content" style={{
                top:"7%",
                bottom:"20%",
                width:"95%",
                height:"100%"
            }}>
                <div><div className="box" >
                    <div className="columns is-multiline is-vcentered">
                    {
                        allunlocks.filter(unlock=>!unlock.unlocked).map((unlock, index) =>
                            <div className="column is-2" key={index}>
                                <p className="subtitle has-text-centered">{unlock.name}</p>
                                <img src={globaux.server_url+unlock.logo}/>
                                <button
                                    disabled={world.money<unlock.seuil}
                                    className=" button is-primary button-53"
                                    onClick={(e)=>{useUnlock(unlock); hideUnlocks(false)}}>
                                    Débloquer {unlock.seuil}€
                                </button>
                            </div>
                        )
                    }
                    </div>
                </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close"
                    onClick={(e)=>hideUnlocks(false)}/>
        </div>);
    }
};

export default allunlocks;
