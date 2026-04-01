const map = document.getElementById("minesMap");
const menu = document.getElementById("menu");
const condition = document.getElementById("face");
const flagNum = document.getElementById("bombRemain");
const counter = document.getElementById("counter");
const startButton = document.getElementById("face");
const small = document.getElementById("small");
const med = document.getElementById("med");
const large = document.getElementById("large");
const custom = document.getElementById("customize");
const mapRows = document.getElementById("mapRows");
const mapCells = document.getElementById("mapCells");
const mapMines = document.getElementById("mapMines");
let start = false;
let generBomb = 10;
let generRow = 9;
let generCol = 9;
let celSize = 59;
let celFont = 40;
let players = false;
let p1, p2;

small.classList.add("pressed");

menu.addEventListener("contextmenu", (e) =>{
	e.preventDefault();
});

function valGen(v,I,J){    //Generarea bombelor si a indicilor
	let x = generBomb;
	while(x > 0){
		if(players)I = J = 31;
		for(let i=0;i<generRow;i++){
			if(x === 0) break;
			for(let j=0;j<generCol;j++){
				if(x === 0) break;
				if(Math.random() < generBomb / (generRow * generCol) && !(i === I && j === J) && v[i][j] !== "💣"){
					x--;
					v[i][j] = "💣";
				}
			}
		}
	}
	
	for(let i=0;i<generRow;i++)
		for(let j=0;j<generCol;j++)
			if(v[i][j] !== "💣"){
				x = 0;
				if(i>0 && v[i-1][j] === "💣") x++;
				if(i>0 && j<generCol-1 && v[i-1][j+1] === "💣") x++;
				if(j<generCol-1 && v[i][j+1] === "💣") x++;
				if(i<generRow-1 && j<generCol-1 && v[i+1][j+1] === "💣") x++;
				if(i<generRow-1 && v[i+1][j] === "💣") x++;
				if(i<generRow-1 && j>0 && v[i+1][j-1] === "💣") x++;
				if(j>0 && v[i][j-1] === "💣") x++;
				if(i>0 && j>0 && v[i-1][j-1] === "💣") x++;
				v[i][j] = x;
			}
}

function countStartStop(){
	if(casute === 0){
		clearInterval(time);
		return;
	}
	else{
		s = 0;
		time = setInterval(() => {
			s++;
			if(s < 10)
				counter.textContent = '0' + '0' + s;
			else if(s < 100)
				counter.textContent = '0' + s;
			else if(s < 1000)
				counter.textContent = s;
			else{
				clearInterval(time);
				counter.textContent = "WTF";
			}
		}, 1000);
	}
}

function numCol(text,v,i,j){    //Colorarea cifrelor
	switch(v[i][j]){
	case 1:text.style.color="blue";break;
	case 2:text.style.color="green";break;
	case 3:text.style.color="red";break;
	case 4:text.style.color="darkblue";break;
	case 5:text.style.color="darkred";break;
	case 6:text.style.color="lime";break;
	case 7:text.style.color="purple";break;
	case 8:text.style.color="gray";break;
	}
}

function bombed(map,v){
	for(let i=0;i<generRow;i++)
		for(let j=0;j<generCol;j++){
			if(v[i][j] === "💣" && map.rows[i].cells[j].textContent !== "🚩"){
				map.rows[i].cells[j].textContent = v[i][j];
				map.rows[i].cells[j].style.backgroundColor = "darkgray";
			}
			if(map.rows[i].cells[j].textContent === "🚩" && v[i][j] !== "💣")
				map.rows[i].cells[j].style.backgroundColor = "darkred";
			map.rows[i].cells[j].classList.add("clicked");
		}
}

function win(v){
	for(let i=0;i<generRow;i++)
		for(let j=0;j<generCol;j++){
			map.rows[i].cells[j].classList.add("clicked");
			if(map.rows[i].cells[j].textContent == "" && v[i][j] === "💣")
				map.rows[i].cells[j].textContent = "🚩";
		}
	if(players){
		if (p1 < p2){
			counter.textContent = "WIN";
			flagNum.textContent = "";
		}
		else if (p1 > p2){
			flagNum.textContent = "WIN";
			counter.textContent = "";
		}
		else{
			counter.textContent = "TIE";
			flagNum.textContent = "TIE";
		}
	}
}

function flagCount(v,i,j){
	let f=0;
	
	if(i>0 && j>0 && map.rows[i-1].cells[j-1].textContent === "🚩")f++;
	if(i>0 && map.rows[i-1].cells[j].textContent === "🚩")f++;
	if(i>0 && j<generCol-1 && map.rows[i-1].cells[j+1].textContent === "🚩")f++;
	if(j>0 && map.rows[i].cells[j-1].textContent === "🚩")f++;
	if(j<generCol-1 && map.rows[i].cells[j+1].textContent === "🚩")f++;
	if(i<generRow-1 && j>0 && map.rows[i+1].cells[j-1].textContent === "🚩")f++;
	if(i<generRow-1 && map.rows[i+1].cells[j].textContent === "🚩")f++;
	if(i<generRow-1 && j<generCol-1 && map.rows[i+1].cells[j+1].textContent === "🚩")f++;
	
	if(f >= map.rows[i].cells[j].textContent)return true;
	else return false;
}

function neighbourUnlock(v,i,j){
	if(i>0 && j>0 && !map.rows[i-1].cells[j-1].classList.contains("clicked"))
		unlock(map.rows[i-1].cells[j-1],v,i-1,j-1);
	if(i>0 && !map.rows[i-1].cells[j].classList.contains("clicked"))
		unlock(map.rows[i-1].cells[j],v,i-1,j);
	if(i>0 && j<generCol-1 && !map.rows[i-1].cells[j+1].classList.contains("clicked"))
		unlock(map.rows[i-1].cells[j+1],v,i-1,j+1);
	if(j>0 && !map.rows[i].cells[j-1].classList.contains("clicked"))
		unlock(map.rows[i].cells[j-1],v,i,j-1);
	if(j<generCol-1 && !map.rows[i].cells[j+1].classList.contains("clicked"))
		unlock(map.rows[i].cells[j+1],v,i,j+1);
	if(i<generRow-1 && j>0 && !map.rows[i+1].cells[j-1].classList.contains("clicked"))
		unlock(map.rows[i+1].cells[j-1],v,i+1,j-1);
	if(i<generRow-1 && !map.rows[i+1].cells[j].classList.contains("clicked"))
		unlock(map.rows[i+1].cells[j],v,i+1,j);
	if(i<generRow-1 && j<generCol-1 && !map.rows[i+1].cells[j+1].classList.contains("clicked"))
		unlock(map.rows[i+1].cells[j+1],v,i+1,j+1);
}

function unlock(cel,v,i,j,boom){    //Afiseaza casuta

	if(players && cel.classList.contains("clicked")){
		if(condition.style.backgroundColor == "lightcoral")
			condition.style.backgroundColor = "lightgreen";
		else condition.style.backgroundColor = "lightcoral";
		return;
	}
	
	if(v[i][j] === "💣")
		if(players){
			if(!oneClick && !noPoints){
				if(condition.style.backgroundColor == "lightcoral"){
					p1-=10;
					if(p1 > 999)
						flagNum.textContent = "WOW";
					else if(p1 <= 999 && p1 >= 100)
						flagNum.textContent = p1;
					else if(p1 < 100 && p1 >= 10)
						flagNum.textContent = '0' + p1;
					else if(p1 < 10 && p1 >= 0)
						flagNum.textContent = '0' + '0' + p1;
					else if(p1 < 0 && p1 >= -9)
						flagNum.textContent = ' ' + p1;
					else if(p1 >= -99)
						flagNum.textContent = p1;
					else flagNum.textContent = "-99";
				}
				else{
					p2-=5;
					if(p2 > 999)
						counter.textContent = "WOW";
					else if(p2 <= 999 && p2 >= 100)
						counter.textContent = p2;
					else if(p2 < 100 && p2 >= 10)
						counter.textContent = '0' + p2;
					else if(p2 < 10 && p2 >= 0)
						counter.textContent = '0' + '0' + p2;
					else if(p2 < 0 && p2 >= -9)
						counter.textContent = ' ' + p2;
					else if(p2 >= -99)
						counter.textContent = p2;
					else counter.textContent = "-99";
				}
				casute--;
			}
		}
		else{
		condition.textContent = "😵";
		bombed(map,v);
		cel.style.backgroundColor = "red";
		boom = true;
		casute = 0;
		countStartStop();
		}
	
	if(cel.classList.contains("clicked"))return;
	cel.classList.add("clicked");
	
	cel.style.backgroundColor = "darkgray";
		
	cel.textContent = v[i][j];
	
	if([1,2,3,4,5,6,7,8].includes(v[i][j])){
		numCol(map.rows[i].cells[j],v,i,j);
		if(players){
			if(!oneClick && !noPoints)
				if(condition.style.backgroundColor == "lightcoral"){
					p1+=2;
					if(p1 > 999)
						flagNum.textContent = "WOW";
					else if(p1 <= 999 && p1 >= 100)
						flagNum.textContent = p1;
					else if(p1 < 100 && p1 >= 10)
						flagNum.textContent = '0' + p1;
					else if(p1 < 10 && p1 >= 0)
						flagNum.textContent = '0' + '0' + p1;
					else if(p1 < 0 && p1 >= -9)
						flagNum.textContent = ' ' + p1;
					else if(p1 >= -99)
						flagNum.textContent = p1;
					else flagNum.textContent = "-99";
				}
				else{
					p2+=2;
					if(p2 > 999)
						counter.textContent = "WOW";
					else if(p2 <= 999 && p2 >= 100)
						counter.textContent = p2;
					else if(p2 < 100 && p2 >= 10)
						counter.textContent = '0' + p2;
					else if(p2 < 10 && p2 >= 0)
						counter.textContent = '0' + '0' + p2;
					else if(p2 < 0 && p2 >= -9)
						counter.textContent = ' ' + p2;
					else if(p2 >= -99)
						counter.textContent = p2;
					else counter.textContent = "-99";
				}
		}
		else{
			casute--;
			if(casute === 0){
				countStartStop();
				condition.textContent = "😎";
				win(v);
			}
			return;
		}
	}
		
	if(v[i][j] === 0){
		if(!players){
			casute--;
			if(casute === 0){
				countStartStop();
				condition.textContent = "😎";
				win(v);
			}
		}
		
		else if(!oneClick && !noPoints){
			oneClick = true;
			if(condition.style.backgroundColor == "lightcoral"){
				p1+=2;
				if(p1 > 999)
					flagNum.textContent = "WOW";
				else if(p1 <= 999 && p1 >= 100)
					flagNum.textContent = p1;
				else if(p1 < 100 && p1 >= 10)
					flagNum.textContent = '0' + p1;
				else if(p1 < 10 && p1 >= 0)
					flagNum.textContent = '0' + '0' + p1;
				else if(p1 < 0 && p1 >= -9)
					flagNum.textContent = ' ' + p1;
				else if(p1 >= -99)
					flagNum.textContent = p1;
				else flagNum.textContent = "-99";
			}
			else{
				p2+=2;
				if(p2 > 999)
					counter.textContent = "WOW";
				else if(p2 <= 999 && p2 >= 100)
					counter.textContent = p2;
				else if(p2 < 100 && p2 >= 10)
					counter.textContent = '0' + p2;
				else if(p2 < 10 && p2 >= 0)
					counter.textContent = '0' + '0' + p2;
				else if(p2 < 0 && p2 >= -9)
					counter.textContent = ' ' + p2;
				else if(p2 >= -99)
					counter.textContent = p2;
				else counter.textContent = "-99";
			}
		}
		
		v[i][j] = " ";
		cel.textContent = v[i][j];
			
		if(i>0 && j>0 && !map.rows[i-1].cells[j-1].classList.contains("clicked") && v[i-1][j-1] !== "💣")
			unlock(map.rows[i-1].cells[j-1],v,i-1,j-1);
		if(i>0 && !map.rows[i-1].cells[j].classList.contains("clicked") && v[i-1][j] !== "💣")
			unlock(map.rows[i-1].cells[j],v,i-1,j);
		if(i>0 && j<generCol-1 && !map.rows[i-1].cells[j+1].classList.contains("clicked") && v[i-1][j+1] !== "💣")
			unlock(map.rows[i-1].cells[j+1],v,i-1,j+1);
		if(j>0 && !map.rows[i].cells[j-1].classList.contains("clicked") && v[i][j-1] !== "💣")
			unlock(map.rows[i].cells[j-1],v,i,j-1);
		if(j<generCol-1 && !map.rows[i].cells[j+1].classList.contains("clicked") && v[i][j+1] !== "💣")
			unlock(map.rows[i].cells[j+1],v,i,j+1);
		if(i<generRow-1 && j>0 && !map.rows[i+1].cells[j-1].classList.contains("clicked") && v[i+1][j-1] !== "💣")
			unlock(map.rows[i+1].cells[j-1],v,i+1,j-1);
		if(i<generRow-1 && !map.rows[i+1].cells[j].classList.contains("clicked") && v[i+1][j] !== "💣")
			unlock(map.rows[i+1].cells[j],v,i+1,j);
		if(i<generRow-1 && j<generCol-1 && !map.rows[i+1].cells[j+1].classList.contains("clicked") && v[i+1][j+1] !== "💣")
			unlock(map.rows[i+1].cells[j+1],v,i+1,j+1);
	}
}
 
let boom; 
let numFlag;
let	casute; 
let s; 
let time; 
let oneClick;
let noPoints;

function newGame(){
	if(players){
		condition.textContent = "";
		if(Math.random() < 0.5) condition.style.backgroundColor = "lightgreen";
		else condition.style.backgroundColor = "lightcoral";
		counter.textContent = "000";
		flagNum.textContent = "000";
		p1 = p2 = 0;
		casute = generBomb;
		counter.classList.add("p2");
	}
	else{
		numFlag = parseInt(generBomb);
		counter.textContent = "000";
		if(numFlag >= 1000)
			flagNum.textContent = "???";
		else if(numFlag < 1000 && numFlag >= 100)
			flagNum.textContent = numFlag;
		else if(numFlag < 100 && numFlag >= 10)
			flagNum.textContent = '0' + numFlag;
		else flagNum.textContent = '0' + '0' + numFlag;
		condition.textContent = "🙂";
		casute = generRow * generCol - generBomb;
		counter.classList.remove("p2");
	}
	if(generCol >= 37) {
		document.querySelector(".game").style.justifyContent = "flex-start";
	} else {
		document.querySelector(".game").style.justifyContent = "center";
	}
	map.innerHTML = "";
	let v = [];
	boom = start = false;
	for(let i=0;i<generRow;i++){
		v[i] = [];
		const row = document.createElement("tr");
		for(let j=0;j<generCol;j++){
			v[i][j] = null;
			const cel = document.createElement("td");
			cel.textContent = "";
			row.appendChild(cel);
			cel.style.width = celSize + "px";
			cel.style.height = celSize + "px";
			cel.style.fontSize = celFont + "px";
			noPoints = false;
			if(i==generRow-1 && j==generCol-1)
				if(players){
					condition.textContent = "";
					if(Math.random() < 0.5) condition.style.backgroundColor = "lightgreen";
					else condition.style.backgroundColor = "lightcoral";
					counter.textContent = "000";
					flagNum.textContent = "000";
				}
				else{
					numFlag = generBomb;
					counter.textContent = "000";
					if(numFlag >= 1000)
						flagNum.textContent = "???";
					else if(numFlag < 1000 && numFlag >= 100)
						flagNum.textContent = numFlag;
					else if(numFlag < 100 && numFlag >= 10)
						flagNum.textContent = '0' + numFlag;
					else flagNum.textContent = '0' + '0' + numFlag;
					condition.textContent = "🙂";
				}
			cel.addEventListener("click", () =>{
				if(players && cel.textContent === "🚩") return;
				if(cel.classList.contains("clicked")){
					if(players)return;
					else if(casute === 0) return;
					else if(flagCount(v,i,j)) neighbourUnlock(v,i,j);
				}
				if(cel.textContent !== "🚩"){
					if(!start){
						let I = i;
						let J = j;
						valGen(v,I,J);
						start = true;
						if(!players)countStartStop();
					}
					oneClick = false;
					unlock(cel,v,i,j,boom);
				}
				if(players)
					if(condition.style.backgroundColor == "lightcoral")
						condition.style.backgroundColor = "lightgreen";
					else condition.style.backgroundColor = "lightcoral";
			});
			cel.addEventListener("contextmenu", (e) =>{
				e.preventDefault();
				if(cel.textContent === "" && numFlag !== 0 && casute !== 0){
					if(!start){
						let I = i;
						let J = j;
						valGen(v,I,J);
						start = true;
						if(!players)countStartStop();
					}
					if(players){
						if(v[i][j] === "💣"){
							cel.textContent = "🚩";
							if(condition.style.backgroundColor == "lightcoral"){
								p1+=5;
								if(p1 > 999)
									flagNum.textContent = "WOW";
								else if(p1 <= 999 && p1 >= 100)
									flagNum.textContent = p1;
								else if(p1 < 100 && p1 >= 10)
									flagNum.textContent = '0' + p1;
								else if(p1 < 10 && p1 >= 0)
									flagNum.textContent = '0' + '0' + p1;
								else if(p1 < 0 && p1 >= -9)
									flagNum.textContent = ' ' + p1;
								else if(p1 >= -99)
									flagNum.textContent = p1;
								else flagNum.textContent = "-99";
							}
							else{
								p2+=5;
								if(p2 > 999)
									counter.textContent = "WOW";
								else if(p2 <= 999 && p2 >= 100)
									counter.textContent = p2;
								else if(p2 < 100 && p2 >= 10)
									counter.textContent = '0' + p2;
								else if(p2 < 10 && p2 >= 0)
									counter.textContent = '0' + '0' + p2;
								else if(p2 < 0 && p2 >= -9)
									counter.textContent = ' ' + p2;
								else if(p2 >= -99)
									counter.textContent = p2;
								else counter.textContent = "-99";
							}
							cel.classList.add("clicked");
							casute--;
							if(casute === 0)win(v);
						}
						else{ 
							oneClick = false;
							noPoints = true;
							unlock(cel,v,i,j,boom);
							noPoints = false;
						}
						if(condition.style.backgroundColor == "lightcoral")
							condition.style.backgroundColor = "lightgreen";
						else condition.style.backgroundColor = "lightcoral";
					}
					else{
						cel.textContent = "🚩";
						numFlag--;
						if(numFlag >= 1000)
							flagNum.textContent = "???";
						else if(numFlag < 1000 && numFlag >= 100)
							flagNum.textContent = numFlag;
						else if(numFlag < 100 && numFlag >= 10)
							flagNum.textContent = '0' + numFlag;
						else flagNum.textContent = '0' + '0' + numFlag;
					}
					cel.classList.add("clicked");
				}
				else if(!players && cel.textContent === "🚩" && casute !== 0){
					cel.classList.remove("clicked");
					cel.textContent = "";
					numFlag++;
					if(numFlag >= 1000)
						flagNum.textContent = "???";
					else if(numFlag < 1000 && numFlag >= 100)
						flagNum.textContent = numFlag;
					else if(numFlag < 100 && numFlag >= 10)
						flagNum.textContent = '0' + numFlag;
					else flagNum.textContent = '0' + '0' + numFlag;
				}
			});
		}
		map.appendChild(row);
	}
}

window.addEventListener("DOMContentLoaded", () => {
	newGame();
});

startButton.addEventListener("click", () => {
	clearInterval(time);
	if(players){
		if(Math.random() < 0.5) condition.style.backgroundColor = "lightgreen";
		else condition.style.backgroundColor = "lightcoral";
	}
	else{
		condition.textContent = "🙂";
		condition.style.backgroundColor = "lightgray";
	}
	newGame();
});

startButton.addEventListener("contextmenu", (e) => {
	clearInterval(time);
	if(players){
		players = false;
		condition.textContent = "🙂";
		condition.style.backgroundColor = "lightgray";
	}
	else{
		players = true;
		condition.textContent = "";
		if(Math.random() < 0.5) condition.style.backgroundColor = "lightgreen";
		else condition.style.backgroundColor = "lightcoral";
	}
	newGame();
});

small.addEventListener("click", () => {    //Generating small map
	generBomb = 10;
	generRow = 9;
	generCol = 9;
	celSize = 59;
	celFont = 40;
	small.classList.add("pressed");
	med.classList.remove("pressed");
	large.classList.remove("pressed");
	newGame();
	if(!players)clearInterval(time);
});

med.addEventListener("click", () => {    //Generating medium map
	generBomb = 40;
	generRow = 16;
	generCol = 16;
	celSize = 32;
	celFont = 23;
	small.classList.remove("pressed");
	med.classList.add("pressed");
	large.classList.remove("pressed");
	newGame();
	if(!players)clearInterval(time);
});

large.addEventListener("click", () => {    //Generating large map
	generBomb = 99;
	generRow = 16;
	generCol = 30;
	celSize = 32;
	celFont = 23;
	small.classList.remove("pressed");
	med.classList.remove("pressed");
	large.classList.add("pressed");
	newGame();
	if(!players)clearInterval(time);
});

custom.addEventListener("click", () => {    //Generating large map
	let bombTest = parseInt(mapMines.value);
	let rowTest = parseInt(mapRows.value);
	let colTest = parseInt(mapCells.value);
	if(!bombTest || !rowTest || !colTest || rowTest < 1 || colTest < 1 || rowTest * colTest <= bombTest){
		custom.style.borderColor = "red";
		return;
	}
	custom.style.borderColor = "gray";
	generRow = rowTest; generCol = colTest; generBomb = bombTest;
	if(generCol < 10 && generRow < 10){
		celSize = 59;
		celFont = 40;
	}
	else{
		celSize = 32;
		celFont = 23;
	}
	small.classList.remove("pressed");
	med.classList.remove("pressed");
	large.classList.remove("pressed");
	newGame();
	if(!players)clearInterval(time);
});

function startGame(){
	document.getElementById("overlay").classList.add("hide");
}