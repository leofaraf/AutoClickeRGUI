import { useState } from "react";
import twitter from "./assets/icons/twitter.png"
import github from "./assets/icons/github.png"
import telegram from "./assets/icons/telegram.png"
import gmail from "./assets/icons/gmail.png"
import discord from "./assets/icons/discord.png"
import {invoke} from "@tauri-apps/api/tauri";

import crab from "./assets/gifs/evil-laugh-crabby-crab.gif"

function App() {
    const [key, setKey] = useState("F6");
    const [cps, setCps] = useState(16);
    const [range, setRange] = useState(3);
    const [dalayRemoved, setRemoved] = useState(false);
    const [mouseButton, setMouseButton] = useState(0);


    const handleCps = (value) => {
        if (value < 0) {
            value = 0;
        } else if (value > 1000) {
            value = 1000;
        }
        invoke('cps', { number: value })
            .then(result => {
                setCps(result);
            })
    }

    const handleLimited = (bool) => {
        invoke('delay_removed', { removed: bool })
            .then(result => {
                setRemoved(result);
            })
    }

    const handleMouseButton = (num) => {
        invoke('mouse_button', { number: num })
            .then(result => {
                setMouseButton(result);
            })
    }

    const handleCpsRange = (value) => {
        invoke('cps_range', { number: value })
            .then(result => {
                setRange(result);
            })
    }

    const handleMode = (modeNum) => {
        if (modeNum === 0) {
            handleLimited(true);
        }  if (modeNum === 1) {
            handleLimited(false);
            handleCps("16");
            handleCpsRange("2");
            handleMouseButton(0)
        } else if (modeNum === 2) {
            handleLimited(false);
            handleCps("12");
            handleCpsRange("4");
            handleMouseButton(0)
        }
    }


    return (
        <div className={"flex flex-col p-2 bg-zinc-800 h-screen w-screen text-white"}>
            <div className={"flex justify-between pb-2"}>
                <div className={"flex items-center"}>
                    <h2 className={"futura-bold pr-3"}>Click settings</h2>
                </div>
                <div className={"flex gap-2"}>
                    <button onClick={() => handleMode(0)}>
                        fastest
                    </button>
                    <button onClick={() => handleMode(1)}>
                        default
                    </button>
                    <button onClick={() => handleMode(2)}>
                        safe
                    </button>
                </div>
                <div className={"flex items-center"}>
                    <h2 className={"futura-bold"}>Anti-detect</h2>
                </div>
            </div>
            <div className={"flex justify-between"}>
                <div className={"rounded-lg grid grid-cols-2 gap-1"}>
                    {!dalayRemoved ? (
                        <div className={"settings_entry"}>
                        <span className={"flex gap-1"}>
                        <p>CPS per second:</p>
                        <input className={"w-14"} type={"number"}
                               value={cps}
                               onChange={(e) => handleCps(e.target.value)}/>
                        </span>
                            <input
                                className={"w-44"}
                                value={cps}
                                onChange={(e) => handleCps(e.target.value)}
                                min={0}
                                max={100}
                                type={"range"}
                            />
                        </div>
                    ) : (
                        <div className="h-full p-1 flex justify-center items-center border-gradient border-gradient-gradient rounded-lg">
                            <div className={"h-full w-full rounded-lg bg-zinc-600 flex justify-center items-center futura-bold text-xs"}>
                                DELAY DESTROYED
                            </div>
                        </div>
                    )}
                    <div className={"settings_entry"}>
                        <p>Click type: </p>
                        <span className={"flex gap-1"}>
                        <button onClick={() => handleMouseButton(0)} className={mouseButton === 0 ?
                            "border-gradient-gradient w-12 h-6 h-full p-1 flex justify-center items-center rounded-lg"
                            : "w-12 h-6 h-full p-1 flex justify-center items-center rounded-lg"}>
                            <div className={"h-full w-full rounded-lg bg-zinc-600 flex justify-center items-center text-xs"}>
                                Left
                            </div>
                        </button>
                        <button onClick={() => handleMouseButton(1)} className={mouseButton === 1 ?
                            "border-gradient-gradient w-16 h-6 h-full p-1 flex justify-center items-center rounded-lg"
                            : "w-16 h-6 h-full p-1 flex justify-center items-center rounded-lg"}>
                            <div className={"h-full w-full rounded-lg bg-zinc-600 flex justify-center items-center text-xs"}>
                                Middle
                            </div>
                        </button>
                        <button onClick={() => handleMouseButton(2)} className={mouseButton === 2 ?
                            "border-gradient-gradient w-12 h-6 h-full p-1 flex justify-center items-center rounded-lg"
                            : "w-12 h-6 h-full p-1 flex justify-center items-center rounded-lg"}>
                            <div className={"h-full w-full rounded-lg bg-zinc-600 flex justify-center items-center text-xs"}>
                                Right
                            </div>
                        </button>
                    </span>
                    </div>
                    {/*<div className={"settings_entry"}>*/}
                    {/*    <p>Toggle autoclicker key: {key} <button className={"inline-flex"}>(choose button)</button></p>*/}
                    {/*</div>*/}
                    {/*<div className={"settings_entry"}>*/}
                    {/*    <p>Cursor position:</p>*/}
                    {/*    <select>*/}
                    {/*        <option>Current</option>*/}
                    {/*        <option>Pick position</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}
                </div>
                <div className={"flex flex-col gap-1"}>
                    {!dalayRemoved ? (
                        <div className={"settings_entry"}>
                            <span className={"flex gap-1"}>
                                <p>CPS delete range:</p>
                                <input className={"w-12"} type={"number"}
                                       value={range}
                                       onChange={(e) => handleCpsRange(e.target.value)}/>
                            </span>
                            <input
                                className={"w-44"}
                                value={range}
                                onChange={(e) => handleCpsRange(e.target.value)}
                                min={1}
                                max={100}
                                type={"range"}
                            />
                        </div>
                    ) : (
                    <div className="w-48 h-full p-1 flex justify-center items-center border-gradient border-gradient-gradient rounded-lg">
                        <div className={"h-full w-full rounded-lg bg-zinc-600 flex justify-center items-center futura-bold text-xs"}>
                            DELAY DESTROYED
                        </div>
                    </div>
                    )}
                    {/*<div className={"settings_entry"}>*/}
                    {/*    <p>Click stop</p>*/}
                    {/*    <select>*/}
                    {/*        <option>No</option>*/}
                    {/*        <option>Stop by click count</option>*/}
                    {/*        <option>Stop by time</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}
                </div>
            </div>

            <div className={"flex pt-3"}>
                <div className={"flex flex-col"}>
                    <p className={"w-52"}>
                        <h2 className={"futura-bold"}>About me</h2>
                        Software developer. I am looking for cool projects,
                        if you want to write a joint project with me - write to me. (telegram in priority)
                    </p>
                    <div className={"flex w-full inline-flex gap-1"}>
                        <a href={"https://t.me/leofaraf"} target="_blank">
                            <img className={"bg-white p-1 w-8 h-8 rounded-lg"} src={telegram} alt="Description of the image"/>
                        </a>
                        <a href={"https://twitter.com/leofaraf"} target="_blank">
                            <img className={"bg-white p-1 w-8 h-8 rounded-lg"} src={twitter} alt="Description of the image"/>
                        </a>
                        <a href={"mailto:leofaraf@gmail.com"} target="_blank">
                            <img className={"bg-white p-1 w-8 h-8 rounded-lg"} src={gmail} alt="Description of the image"/>
                        </a>
                        <a href={"https://discordapp.com/users/1106200623260631153"} target="_blank">
                            <img className={"bg-white p-1 w-9 h-8 rounded-lg"} src={discord} alt="Description of the image"/>
                        </a>
                        <a href={"https://github.com/leofaraf"} target="_blank">
                            <img className={"bg-white p-1 w-8 h-8 rounded-lg"} src={github} alt="Description of the image"/>
                        </a>
                    </div>
                </div>
                <div className={"w-full z-0 flex justify-end items-end"}>
                    <div className={"w-80 h-20 border-gradient-gradient blur-3xl bg-white"}></div>
                </div>
            </div>
        </div>
    )
}

export default App;
