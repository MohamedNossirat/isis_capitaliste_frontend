import React from "react";
import { Palier, World } from "../../world";
import globaux from "../globals";

type ManagersProps = {
  upgrades: Palier[];
  showUpgrades: boolean;
  hideUpgrades: (c: boolean) => void;
  world: World;
  buyUpgrade: (upgrade: Palier) => void;
};
const Upgrades = ({
  upgrades,
  showUpgrades,
  hideUpgrades,
  world,
  buyUpgrade,
}: ManagersProps) => {
  let className: string = "";
  if (!showUpgrades) return <div></div>;
  else {
    className = " modal is-active";
    return (
      <div className={className}>
        <div className="modal-background"></div>
        <div
          className="modal-content"
          style={{
            top: "7%",
            bottom: "20%",
            width: "95%",
            height: "100%",
          }}
        >
          <div>
            <div className="box">
              <div className="columns is-multiline is-vcentered">
                {upgrades.map((upgrade, index) => (
                  <div className="column is-2" key={index}>
                    <p className="subtitle has-text-centered">{upgrade.name}</p>
                    <p className="heading">
                      {world.products[upgrade.idcible - 1].name}
                    </p>
                    <img src={globaux.server_url + upgrade.logo} />
                    <button
                      disabled={world.money < upgrade.seuil}
                      className=" button is-primary button-53"
                      onClick={(e) => {
                        buyUpgrade(upgrade);
                        hideUpgrades(false);
                      }}
                    >
                      Buy {upgrade.seuil}€
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="button is-success"
                onClick={(e) => hideUpgrades(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={(e) => hideUpgrades(false)}
        />
      </div>
    );
  }
};

export default Upgrades;
