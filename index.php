<?php

	/* hämta kortleken och unika nummer-generatorn */
	require './cards.php';
	require './functions.php';
	
	$shoe = array();
	
	/* blanda kortleken och ange hur många totala kortlekar vi ska ha med (1 som standard) */
	function shuffle_cards($tot=1, $deck, $shoe)
	{
		$shoe = array_merge_deep($deck);
		
		/* om vi har fler kortlekar, släng in dem i skon */
		while ($tot-1)
		{
			$shoe = array_merge($shoe, array_merge_deep($deck));
			$tot--;
		}
		
		shuffle($shoe);
		
		return $shoe;
	}

	/* blanda kortlekarna */
	if (isset($_GET['decks']) && is_numeric($_GET['decks']) && ($_GET['decks'] < 20))
	{
		$numberofdecks = $_GET['decks'];
		$shoe = shuffle_cards($numberofdecks, $deck, $shoe);
	}
	else
		$shoe = shuffle_cards(6, $deck, $shoe);

?>

<html>
<head>
	<title>Black Jack</title>
	<meta http-equiv="content-type" content="text/html;charset=iso-8859-1">
	<link rel="stylesheet" href="./style.css" type="text/css">
	<script type="text/javascript" src="./blackjack.js"></script>
</head>
<body onkeydown="keyboard(event)">

<div id="page">

	<div id="content">
		
		<div id="action">
			<form name="f_action">
				<input type="button" name="button_deal" value="Deal" class="button" onfocus="deal(true)" onclick="this.focus(); this.blur()" />
				<input type="button" name="button_hit" value="Hit" class="button" onfocus="hit()" onclick="this.focus(); this.blur()" disabled="true" />
				<input type="button" name="button_stand" value="Stand" class="button" onfocus="stand()" onclick="this.focus(); this.blur()" disabled="true" />
				<input type="button" name="button_double" value="Double" class="button" onfocus="double()" onclick="this.focus(); this.blur()" disabled="true" />
				<input type="button" name="button_split" value="Split" class="button" onfocus="split()" onclick="this.focus(); this.blur()" disabled="true" />
				<br />
				<input type="button" name="button_help" value="Help" class="button" onfocus="help()" onclick="this.focus(); this.blur()" />
			</form>
		</div>
		
		<div id="dealerCount"></div>		
<?php
	/* dela ut alla */
	for ($i=0; $i<count($shoe); $i++)
	{
		echo "\t\t"."<div id=\"card-" . $i . "\" class=\"card\"><div id=\"msgTop-" . $i . "\"></div><img id=\"img-card-" . $i . "\" src=\"./imgs/classic/" . $shoe[$i] . ".png\" width=\"71\" height=\"96\" alt=\"" . $shoe[$i] . "\" /><div id=\"msgBot-" . $i . "\"></div></div>\n";
	}
	/*
		STANDARD:		width=\"150\" height=\"215\"
		CLASSIC:		width="71" height="96"
	*/
?>
		<div id="backdrop" onclick="if(document.getElementById('hiloField').style.display=='none'){document.getElementById('hiloField').style.display='table-row';document.getElementById('cardsLeft').style.display='table-row';}else{document.getElementById('hiloField').style.display='none';document.getElementById('cardsLeft').style.display='none';}"><img src="./imgs/classic/back.png" width="71" height="96" alt="" /></div>
		
		<div id="status">
			<form name="f_status">
				<input type="hidden" name="status_cards_total" value="<?=(isset($numberofdecks)?$numberofdecks*52:6*52)?>" />
				<table>
					<tr>
						<td class="left">Bank roll:</td><td><input type="text" class="text" name="status_bankroll" disabled="disabled" value="" /></td>
					</tr>
					<tr>
						<td>Games:</td><td><input type="text" class="text" name="status_games" disabled="disabled" value=" " /></td>
					</tr>
					<tr><td colspan="2">&nbsp;</td></tr>					
					<tr id="cardsLeft">
						<td class="left">Cards left:</td><td><input type="text" class="text" name="status_cardsleft" disabled="disabled" value=" " /></td>
					</tr>
					<tr id="hiloField">
						<td class="left">Hi-Lo:</td><td><input type="text" class="text" name="status_hilo" disabled="disabled" value=" " /></td>
					</tr>
				</table>
			</form>
		</div>
		
		<div id="settings">
			<form name="f_settings">
				<table>
					<tr>
						<td class="left">Bet:</td>
						<td>
							<select name="bet_one">
								<option value="20" selected="selected">20</option>
								<option value="30">30</option>
								<option value="40">40</option>
								<option value="50">50</option>
								<option value="60">60</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class="left">Bet:</td>
						<td>
							<select name="bet_two" onchange="if(this.value==0){document.f_settings.bet_three.disabled=true;document.f_settings.bet_four.disabled=true;}else{document.f_settings.bet_three.disabled=false;}">
								<option value="0" selected="selected">0</option>
								<option value="20">20</option>
								<option value="30">30</option>
								<option value="40">40</option>
								<option value="50">50</option>
								<option value="60">60</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class="left">Bet:</td>
						<td>
							<select name="bet_three" disabled="disabled" onchange="(this.value==0)?document.f_settings.bet_four.disabled=true : document.f_settings.bet_four.disabled=false;">
								<option value="0" selected="selected">0</option>
								<option value="20">20</option>
								<option value="30">30</option>
								<option value="40">40</option>
								<option value="50">50</option>
								<option value="60">60</option>	
							</select>
						</td>
					</tr>
					<tr>
						<td class="left">Bet:</td>
						<td>
							<select name="bet_four" disabled="disabled">
								<option value="0" selected="selected">0</option>
								<option value="20">20</option>
								<option value="30">30</option>
								<option value="40">40</option>
								<option value="50">50</option>
								<option value="60">60</option>
							</select>
						</td>
					</tr>
				</table>
			</form>
		</div>
		
		<div id="basicstrategy">
			<p style="display: none;">
				0. NEVER TAKE INSURANCE!<br />
				1. If you have a 10 or and 11 you double down.<br />
				2. If the dealers up card is a 7 or higher and you are holding a 12-16 then hit. You should stand if the dealers card is less than 7.<br />
				3. You have a soft 17 or lower then hit.<br />
				4. You have a soft 19 then stand.<br />
				5. Split all pairs when the dealers upcard is less than 6.<br />
				6. Always split Aces and Eights.<br />
				7. If the total of your cards equals 9 or lower you should always take a hit.<br />
				8. If you have a soft 13 to 18. You should double down if the dealers upcard is a 5 or a 6.<br />
			</p>
			<table>
				<tr><td class="left">2-8</td><td>hit</td></tr>
				<tr><td>9</td><td>3-6 double / hit</td></tr>
				<tr><td>10-11</td><td>2-9 double / hit</td></tr>
				<tr><td>12</td><td>4-6 stand / hit</td></tr>
				<tr><td>13-16</td><td>2-6 stand / hit</td></tr>
				<tr><td>17-21</td><td>stand</td></tr>
				<tr colspan="2"><td>&nbsp;</td></tr>
				<tr><td>A,2-6</td><td>hit</td></tr>
				<tr><td>A,7</td><td>2-8 stand / hit</td></tr>
				<tr><td>A,8-9</td><td>stand</td></tr>
				<tr colspan="2"><td>&nbsp;</td></tr>
				<tr><td>2,2-3,3</td><td>4-7 split / hit</td></tr>
				<tr><td>4,4</td><td>hit</td></tr>
				<tr><td>5,5</td><td>2-9 double / hit</td></tr>
				<tr><td>6,6</td><td>3-6 split / double</td></tr>
				<tr><td>7,7</td><td>2-7 split / hit</td></tr>
				<tr><td>8,8</td><td>2-9 split / hit</td></tr>
				<tr><td>9,9</td><td>2-6,8-9 split / stand</td></tr>
				<tr><td>T,T</td><td>stand</td></tr>
				<tr><td>A,A</td><td>A stand / split</td></tr>
			</table>
				
			<!-- 	<img src="./imgs/bj_euro.gif" width="324" height="620" />	//-->
		</div>
		
		<div id="popup">
			<div id="msgBox">
			</div>
		</div>
		
	</div>

</div>

</body>
</html>