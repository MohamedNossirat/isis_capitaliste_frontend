import React from "react";
import { Palier, World } from "../../world";
import globaux from "../globals";

type UnlocksProps = {
  productsUnlocks: Palier[];
  unlocksGeneraux: Palier[];
  showUnlocks: boolean;
  hideUnlocks: (c: boolean) => void;
  world: World;
};

const lesUnlocks = ({
  productsUnlocks,
  unlocksGeneraux,
  showUnlocks,
  hideUnlocks,
  world,
}: UnlocksProps) => {
  let className: string = "";
  if (!showUnlocks) return <div></div>;
  else {
    className = " modal is-active";
    return (
      <div className={className}>
        <div className="modal-background"></div>
        <div
          className="modal-content"
          style={{
            width: "95%",
          }}
        >
          <div className="box">
            <div className="columns">
              <div className="column is-8">
                <p className="subtitle">Les unlocks des produits</p>
                <div className="columns is-multiline">
                  {productsUnlocks.map((unlock, index) => (
                    <div className="column is-2" key={index}>
                      <p className="subtitle has-text-centered">
                        {unlock.name}
                      </p>
                      <p className="heading">
                        Pour: {world.products[unlock.idcible - 1].name}
                      </p>
                      <img
                        src={
                          globaux.server_url +
                          world.products[unlock.idcible - 1].logo
                        }
                      />
                      <p>Seuil : {unlock.seuil}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="column is-4">
                <p className="subtitle">Les unlocks Gégéraux</p>
                <div className="columns is-multiline is-vcentered">
                  {unlocksGeneraux.map((unlock, index) => (
                    <div className="column is-6" key={index}>
                      <p className="subtitle has-text-centered">
                        {unlock.name}
                      </p>
                      <p className="heading">{unlock.name}</p>
                      <img src={globaux.server_url + unlock.logo}/>
                      <p>Seuil : {unlock.seuil}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="button is-success"
              onClick={(e) => hideUnlocks(false)}
            >
              Fermer
            </button>
          </div>
        </div>

        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={(e) => hideUnlocks(false)}
        />
      </div>
    );
  }
};

export default lesUnlocks;
