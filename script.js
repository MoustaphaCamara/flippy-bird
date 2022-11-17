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

// pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth;
// parallax :
let index = 0,
  bestScore = 0,
  currentScore = 0,
  pipes = [],
  flight,
  flyHeight;
//setup reset
const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - size[1] / 2;

  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
  // Array [1,2] 1 = distance par rapport au bird, 2 = hauteur de la pipe aka (pipeLoc)
  console.log(pipes);
};
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

  // pipe display

  if (gamePlaying) {
    pipes.map((pipe) => {
      pipe[0] -= speed;
      // pipe pop d'en haut
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );
      // pipe du bottom
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      // à chaque passage de pipe
      if (pipe[0] <= -pipeWidth) {
        // set score & best score
        currentScore++;
        bestScore = Math.max(bestScore, currentScore); //garder la valeur la plus haute entre bestScore et current
        // remove pipe and add new ones
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
        /*
        on se reprend l'array avec spread ope, on enlève le 1er élément, on rajoute un pipes en partant de length -1 (2e emplacement) pour rajouter un pipeGap & pipe Width, et on rajoute pipeLoc
        */
      }
      //if pipe is hit, end of game :
      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }
  // display score
  document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScore}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Actuel : ${currentScore}`;

  window.requestAnimationFrame(render); //pour relancer render en boucle
};
setup();
img.onload = render; //au chargement, lancer render

// lancer le jeu
document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);
