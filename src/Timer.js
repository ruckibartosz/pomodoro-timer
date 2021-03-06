import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./playButton";
import PauseButton from "./PauseButton";
import Button from "./Button";
import "./Timer.css";
import { useContext, useState, useEffect, useRef } from "react";
import settingContext from "./settingContext";
import AlarmSound from './Alarm.mp3';

function Timer() {
  const settingsInfo = useContext(settingContext);

  const [isPaused, setIsPaused] = useState(true);
  let [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);
  const alarmRef = useRef();
  
  

  const tick = () => {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  };
  const timeup = () => {
    //console.log(alarmRef.current);
    //console.log(isPausedRef.current);
    alarmRef.current && alarmRef.current.play();
  }
  


  useEffect(() => {
    const switchMode = () => {
      const nextMode = modeRef.current === "work" ? "break" : "work";
      const timeMode =
        (nextMode === "work"
          ? settingsInfo.workMinutes
          : settingsInfo.breakMinutes) * 60;
      setMode(nextMode);

      modeRef.current = nextMode;
      setSecondsLeft(timeMode);
      secondsLeftRef.current = timeMode;
    };
    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }
      tick();
    }, 1000);


    return () => clearInterval(interval);
  }, [settingsInfo]);
  
  

  const totalseconds =
    mode === "work"
      ? settingsInfo.workMinutes * 60
      : settingsInfo.breakMinutes * 60;

  const percentage = Math.round((secondsLeft / totalseconds) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  if(secondsLeft < 20){
    timeup();
  }

  
  return (
    <div>
      <audio ref={alarmRef}>
				<source src={AlarmSound} type="audio/mp3" />
				Your browser does not support the audio element.
			</audio>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        Pomodoro Todo App
      </h1>
      <CircularProgressbar
        value={percentage}
        text={minutes + ":" + seconds}
        styles={buildStyles({
          textColor: "#eee",
          pathColor: mode === "work" ? "#3E98C7" : "#00FF00",
          tailColor: "green",
          strokeLinecap: "50",
        })}
      />
      <div className="icon-wrapper">
        {isPaused ? (
          <PlayButton
            style={{ cursor: "pointer" }}
            onClick={() => {
              setIsPaused(false);
              isPausedRef.current = false;
            }}
          />
        ) : (
          <PauseButton
            style={{ cursor: "pointer" }}
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
            }}
          />
        )}
      </div>   
      <div className="button-wrapper">
        <Button onClick={() => settingsInfo.setShowSettings(true)}>
          Settings
        </Button>
      </div>
    </div>
  );
}

export default Timer;
