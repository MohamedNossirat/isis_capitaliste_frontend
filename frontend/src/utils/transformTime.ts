export default function transformTime(time:number):string{
    let millisecondes = time % 1000;
    time = (time - millisecondes)/1000;
    let secondes = time % 60;
    time = (time-secondes)/60;
    let minutes = time % 60;
    if(millisecondes>100){millisecondes/=10}
    return `${minutes}:${secondes}:${Math.round(millisecondes)}`
}