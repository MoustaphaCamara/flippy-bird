const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";

// general settings
let gamePlaying = false;
const gravity = 0.5;
// vitesse des poteaux
const speed = 6.2;
// taille de l'oiseau [Larg, hauteur]
const size = [51, 36];
const jump = -11.5;
const cTenth = canvas.width / 10;
// parallax :
let index = 0,
  bestScore = 0,
  currentScore = 0,
  pipes = [],
  flight,
  flyHeight;

const render = () => {
  index++;
  // dans docu, ctx.drawImage(image, sx,sy,sLargeur,sHauteur) où est ce qu'on prend l'image, les 4 derniers paramètres = où est-ce qu'on colle l'image. à chaque render on va décaler l'image

  //------- -->background
  // 1st one
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  // 2nd one for infinite loop effect
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width), //on enlève + canvas.width pour qu'il commence normal
    0,
    canvas.width,
    canvas.height
  );

  //   gameplay
  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    //------- -->oiseau

    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1], //récupérer les 3 premiers sprites
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );
    //cf docu.; spread operator ...size pour sLargeur & sHauteur (ici [51,36])
    flyHeight = canvas.height / 2 - size[1] / 2;
    //   hauteur de vole = hauteur canvas /2 (milieu) - hauteur de l'oiseau /2

    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText(`Cliquez pour jouer`, 48, 535);
    ctx.font = "bold 30px courier";
  }

  window.requestAnimationFrame(render); //pour relancer render en boucle
};
img.onload = render; //au chargement, lancer render

// lancer le jeu
document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);
