import React, { useEffect, useState } from "react";
import { Palier, Product, World } from "../../world";
import "./main.css";
import ProductView from "./Product";
import transform from "../utils/transform";
import Managers from "./Managers";
import Allunlocks from "./Allunlocks";
import Upgrades from "./upgrades";
import { toast } from "bulma-toast";
import globaux from "../globals";
import { gql, useMutation } from "@apollo/client";

type MainProps = {
  loadworld: World;
  user: String;
};

export default function Main({ loadworld, user }: MainProps) {
  const [world, setWorld] = useState(
    JSON.parse(JSON.stringify(loadworld)) as World
  );
  const [qtmulti, setQtmulti] = useState("1");
  const [showManager, setShowManager] = useState(false);
  const [showUnlocks, setShowUnlocks] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [managersDeblock, setManagersDeblock] = useState(0);
  const [unlocksDeblock, setUnlocksDeblock] = useState<Palier[] | []>([]);
  const [unlocksGeneraux, setUnlocksGeneraux] = useState<Palier[] | []>([]);
  const [upgrades, setUpgrades] = useState<Palier[] | []>([]);

  const style = {
    backgroundImage: `url('${globaux.server_url}${world.logo}')`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "150px",
    width: "196px",
    padding: "0px",
  };
  //Affichez le badge Managers
  useEffect(() => {
    let managers = world.managers.filter(
      (manager) => manager.seuil <= world.money && !manager.unlocked
    );
    setManagersDeblock(managers.length);
  }, [world.managers, world.money]);
  //les unlocks concernant chaque produit
  useEffect(() => {
    let productsUnlocks: Palier[] = [];
    world.products.forEach((product) => {
      product.paliers.forEach((palier) => {
        if (!palier.unlocked) {
          productsUnlocks.push(palier);
        }
      });
    });
    setUnlocksDeblock(productsUnlocks);
  }, [world]);
  //les unlocks génerales
  useEffect(() => {
    let unlocksGeneraux: Palier[] = [];
    world.allunlocks.forEach((unlock) => {
      if (!unlock.unlocked) {
        unlocksGeneraux.push(unlock);
      }
    });
    setUnlocksGeneraux(unlocksGeneraux);
    unlocksGeneraux.forEach((unlock) => {
      if (
        world.products.every((product) => product.quantite === unlock.seuil)
      ) {
        if (unlock.typeratio === "vitesse") {
          world.products.every((product) => product.vitesse / unlock.ratio);
          unlock.unlocked = true;
          toast({
            message: `L'unlock général ${unlock.name} a mis la ${unlock.typeratio}/${unlock.ratio}`,
            type: "is-info",
            position: "top-right",
          });
        }
        if (unlock.typeratio === "gain") {
          world.products.every((product) => product.revenu * unlock.ratio);
          unlock.unlocked = true;
          toast({
            message: `L'unlock général ${unlock.name} a mis la ${unlock.typeratio}X${unlock.ratio}`,
            type: "is-info",
            position: "top-right",
          });
        }
      }
    });
  }, [world]);
  //Les Upgrades
  useEffect(() => {
    let upgrades = world.upgrades.filter((upgrade) => !upgrade.unlocked);
    setUpgrades(upgrades);
    console.log(upgrades);
  }, [world]);
  //reparser le monde
  useEffect(() => {
    setWorld(JSON.parse(JSON.stringify(loadworld)) as World);
  }, [loadworld]);
  //Afficher les unlocks

  const hideManager = (c: boolean) => {
    setShowManager(c);
  };

  const hideUnlocks = (c: boolean) => {
    setShowUnlocks(c);
  };
  const hideUpgrades = (c: boolean) => {
    setShowUpgrades(c);
  };
  //calculer les revenues des produits
  const onProductionDone = (p: Product, qt: number): void => {
    let gain: number =
      qt *
      p.revenu *
      p.quantite *
      (1 + (world.angelbonus * world.activeangels) / 100);
    addToScore(gain);
    setWorld((world) => ({ ...world, score: world.score + p.quantite }));
  };
  const onProductBuy = (quantite: number, product: Product) => {
    let perte = quantite * product.cout;
    setWorld((world) => ({ ...world, money: world.money - perte }));
  };
  //mettre à jour le monde
  const addToScore = (value: number): void => {
    setWorld((world) => ({ ...world, money: world.money + value }));
  };

  // changer l'affichage de commutateur des quantité de produits à acheter
  const commutateur = () => {
    switch (qtmulti) {
      case "1":
        setQtmulti("10");
        break;
      case "10":
        setQtmulti("100");
        break;
      case "100":
        setQtmulti("Max");
        break;
      default:
        setQtmulti("1");
    }
  };
  //engagement d'un Manager
  const ENGAGE_MANAGER = gql`
    mutation engagerManager($name: String!) {
      engagerManager(name: $name) {
        name
      }
    }
  `;
  const [engagerManager] = useMutation(ENGAGE_MANAGER, {
    context: { headers: { "x-user": user } },
  });
  //engagement d'un manager 

  const hireManager = (manager: Palier) => {
    engagerManager({ variables: { name: manager.name } });
    let product: Product = world.products[manager.idcible - 1];
    if (product.id === manager.idcible) {
      if (world.money >= manager.seuil) {
        setWorld((world) => ({ ...world, money: world.money - manager.seuil }));
        manager.unlocked = true;
        product.managerUnlocked = true;
        toast({
          message: `<div class="columns is-multiline">
<div class="column is-12">
<h1 class="subtitle has-addons-centered">Dr: ${manager.name} vient d'être engagé pour vous</h1>
</div>
<div class="column is-12">
<figure class="image is-128x128">
  <img src="${globaux.server_url}${manager.logo}">
</figure>
</div>
</div>`,
          type: "is-success",
          duration: 5000,
          position: "center",
          dismissible: true,
        });
      }
    }
  };
  const buyUpgrade = (upgrade: Palier) => {
    let product: Product = world.products[upgrade.idcible - 1];
      if (world.money >= upgrade.seuil) {
        setWorld((world) => ({ ...world, money: world.money - upgrade.seuil }));
        upgrade.unlocked = true;
        console.log(product)
      }
  };

  if (world.products.length === 0 && world.managers.length === 0)
    return <div></div>;
  else {
    return (
      <>
        <div className="level mt-0 mb-0">
          <div className="level-left ml-0 pl-0">
            <div className="level-item has-text-centered">
              <div style={style} />
            </div>
          </div>

          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Gain</p>
              <p className="title button-53">
                <span
                  dangerouslySetInnerHTML={{ __html: transform(world.money) }}
                />
                €
              </p>
            </div>
          </div>

          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Nievau</p>
              <p className="title button-53">{world.score}</p>
            </div>
          </div>

          <div className="level-right">
            <button
              id="commuateur"
              onClick={commutateur}
              className="button-49 is-clickable"
            >
              X{qtmulti}
            </button>
          </div>
        </div>
        <div className="columns is-multiline">
          <div className="column is-12">
            <div className="level">
              <div className="level-item has-text-centered">
                <button
                  className="button-55"
                  disabled={managersDeblock === 0}
                  onClick={(e) => setShowManager(!showManager)}
                >
                  Managers
                  {managersDeblock > 0 && (
                    <span
                      style={{
                        position: "relative",
                        top: "-20px",
                        right: "-20px",
                        padding: "1px 8px",
                        borderRadius: "50%",
                        background: "red",
                        color: "white",
                      }}
                    >
                      {managersDeblock ? managersDeblock : ""}
                    </span>
                  )}
                </button>
              </div>

              <div className="level-item has-text-centered">
                <button
                  className="button-55"
                  onClick={(e) => setShowUnlocks(!showUnlocks)}
                >
                  Unlocks
                </button>
              </div>

              <div className="level-item has-text-centered">
                <button 
                className="button-55"
                onClick={(e)=> setShowUpgrades(true)}
                >Upgrades
                {upgrades.length > 0 && (
                    <span
                      style={{
                        position: "relative",
                        top: "-20px",
                        right: "-20px",
                        padding: "1px 8px",
                        borderRadius: "50%",
                        background: "red",
                        color: "white",
                      }}
                    >
                      {upgrades ? upgrades.length : ""}
                    </span>
                  )}</button>
              </div>
            </div>
          </div>
          <div className="column is-12">
            <div className="columns is-vcentered is-multiline">
              {world.products.map((prod, index) => (
                <ProductView
                  key={index}
                  prod={prod}
                  onProductDone={onProductionDone}
                  onProductBuy={onProductBuy}
                  qtmulti={qtmulti}
                  wordmoney={world.money}
                  user={user}
                />
              ))}
            </div>
          </div>
          <Managers
            managers={world.managers}
            showManager={showManager}
            hideManager={hideManager}
            world={world}
            hireManager={hireManager}
          />

          <Allunlocks
            productsUnlocks={unlocksDeblock}
            unlocksGeneraux={unlocksGeneraux}
            showUnlocks={showUnlocks}
            hideUnlocks={hideUnlocks}
            world={world}
          />
          <Upgrades
          upgrades={upgrades}
          hideUpgrades={hideUpgrades}
          showUpgrades={showUpgrades}
          world={world}
          buyUpgrade={buyUpgrade}
          />
        </div>
      </>
    );
  }
}
