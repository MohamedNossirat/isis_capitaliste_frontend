import React, { useEffect, useRef, useState } from "react";
import { Product } from "../../world";
import transform from "../../src/utils/transform";
import transformTime from "../utils/transformTime";
import { gql, useMutation } from "@apollo/client";
import globaux from "../globals";

type ProductProps = {
  prod: Product;
  onProductDone: (product: Product) => void;
  qtmulti: string;
  wordmoney: number;
  onProductBuy: (quantite: number, product: Product) => void;
  user: String;
};

export default function ProductView({
  prod,
  onProductDone,
  onProductBuy,
  qtmulti,
  wordmoney,
  user,
}: ProductProps) {
  const [progress, setProgress] = useState(0);
  const [maxQuantite, setMaxQuantite] = useState(0);
  const [cout, setCout] = useState(prod.cout);

  //******mutations GQL******
  const LANCER_PRODUCTION = gql`
    mutation lancerProductionProduit($id: Int!) {
      lancerProductionProduit(id: $id) {
        id
      }
    }
  `;
  const [lancerProduction] = useMutation(LANCER_PRODUCTION, {
    context: { headers: { "x-user": user } },
  });

  const BUY_PRODUCT = gql`
    mutation acheterQtProduit($id: Int!, $quantite: Int!) {
      acheterQtProduit(id: $id, quantite: $quantite) {
        id
        quantite
      }
    }
  `;
  const [acheterQtProduit] = useMutation(BUY_PRODUCT, {
    context: { headers: { "x-user": user } },
  });
  //*******FIN*******

  //fonction qui demarre la fabrication d'un produit
  const startFabrication = () => {
    if (prod.quantite >= 0) {
      lancerProduction({ variables: { id: prod.id } });
      prod.timeleft = prod.vitesse;
      prod.lastupdate = Date.now();
    }
  };

  //function pour calculer le maximum que le joueur peut acheter
  function calcMaxCanBuy() {
    if (qtmulti === "Max") {
      let n = Math.floor(
        Math.log(1 - (wordmoney * (1 - prod.croissance)) / prod.cout) /
          Math.log(prod.croissance)
      );
      setMaxQuantite(n);
      setCout(CoutDeNProducts(maxQuantite));
    } else {
      setMaxQuantite(Number(qtmulti));
      setCout(prod.cout * Number(qtmulti));
    }
  }

  //une fonction qui calcule le cout des produits achetés
  function CoutDeNProducts(n: number) {
    return Math.round(
      (prod.cout * (1 - Math.pow(prod.croissance, n))) / (1 - prod.croissance)
    );
  }

  //la fonction qui permets le joueur d'acheter plus des produits
  function buyProduct() {
    prod.quantite += maxQuantite;
    onProductBuy(maxQuantite, prod);
    prod.cout = prod.cout * Math.pow(prod.croissance, maxQuantite);
    acheterQtProduit({ variables: { id: prod.id, quantite: maxQuantite } });
  }

  useEffect(() => {
    calcMaxCanBuy();
  });

  //The principal Game Loop
  function calcScore() {
    if (prod.timeleft !== 0|| prod.managerUnlocked) {
      let qt = 0;
      let time_since_last_update = Date.now() - prod.lastupdate;
      prod.lastupdate = Date.now();
      let time = time_since_last_update - prod.timeleft;
      if (time >= 0) {
        qt = 1;
        prod.timeleft = 0;
        if (prod.managerUnlocked) {
          qt += time / prod.vitesse;
          prod.timeleft = prod.vitesse - (time % prod.vitesse);
        }
        onProductDone(prod);
      } else {
        prod.timeleft = -time;
      }
      if (prod.timeleft === 0) {
        setProgress(0);
      } else {
        let progressBar = ((prod.vitesse - prod.timeleft) / prod.vitesse) * 100;
        setProgress(Math.round(progressBar));
      }
    }
  }

  //Principal Hook
  const savedCallback = useRef(calcScore);
  useEffect(() => (savedCallback.current = calcScore));
  useEffect(() => {
    let timer = setInterval(() => savedCallback.current(), 500);
    return function cleanup() {
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <div className="column is-2">
      <div className="card">
        <div className="card-header">
          <p className="card-header-title is-centered">{prod.name}</p>
        </div>
        <div className="card-content">
          <p className="has-text-centered">
            <strong>{transformTime(prod.timeleft)}</strong>
          </p>
          <progress
            className="progress is-success is-large"
            value={progress}
            max="100"
          />
        </div>
        <div className="card-image">
          <figure className="image is-3by2">
            <img
              className="is-clickable"
              src={globaux.server_url + prod.logo}
              onClick={startFabrication}
              alt="product_image"
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="level">
            <div className="level-item has-text-centered">
              <div>
                <div className="heading">Revenus</div>
                <p>{prod.revenu * prod.quantite}</p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <div className="heading">Quantité</div>
                <p>{prod.quantite}</p>
              </div>
            </div>
          </div>
          <div className="level">
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Quantité</p>
                <button
                  disabled={cout > wordmoney}
                  title="Cliquez pour acheter"
                  className="button is-success"
                  onClick={buyProduct}
                >
                  X {maxQuantite}
                </button>
              </div>
            </div>

            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Cout</p>
                <span className="tag is-info is-rounded is-large">
                  <span dangerouslySetInnerHTML={{ __html: transform(cout) }} />
                  €
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
