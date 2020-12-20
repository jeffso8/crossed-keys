import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3001";
const socket = socketIOClient(ENDPOINT);


export function updateRedScore(data) {
  socket.on('updateRedScore', (data) => {
    setRedScore(data.redScore);
  });
  socket.emit('redScoreChange', {roomID, gameScore: redScore});
}

export function updateBlueScore(data) {
  socket.on('updateBlueScore', (data) => {
    setBlueScore(data.blueScore);
  });
  socket.emit('blueScoreChange', {roomID, gameScore: blueScore});
}
