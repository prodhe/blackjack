<!--
	
	// the global container
	var g = new Array();
	
	// some useful stuff
	g['cID'] = 0;
	g['timer'] = 0;
	g['savedTimeOuts'] = new Array();
	g['active_hand'] = 0;
	g['games_played'] = 0;
	g['hiloCount']=0;
	g['bankroll']=500;
	
	// to switch images for the cards
		// standard
		// g['cardPosIncrementTop']=48;
		// g['cardPosIncrementLeft']=34;
		// classic
		g['cardPosIncrementTop']=20;
		g['cardPosIncrementLeft']=14;
	
	// variables to keep track of the dealer and player's hands
	var player = new Array();
	var dealer = new Array();
	
	// set all the basic values for a new hand
	function create_hand(n)
	{
		if (player[n])
			player[n].splice(0,player[n].length)
		player[n] = new Array();
		player[n]['blackjack'] = false;
		player[n]['double'] = false;
		player[n]['splitted'] = false;
		player[n]['bet'] = 0;
		player[n]['pos_top_base'] = 360;
		player[n]['pos_left_base'] = (document.getElementById('page').offsetWidth / 2) + 120 - 120*n;
		player[n]['pos_top'] = player[n]['pos_top_base'];
		player[n]['pos_left'] = player[n]['pos_left_base'];
		player[n]['cards'] = new Array();
		player[n]['cardsID'] = new Array();
	}
	
	// reset the dealer's values
	function reset_dealer()
	{
		dealer['blackjack'] = false;
		dealer['pos_top_base'] = 60;
		dealer['pos_left_base'] = (document.getElementById('page').offsetWidth / 2) - 150;
		dealer['pos_top'] = dealer['pos_top_base'];
		dealer['pos_left'] = dealer['pos_left_base'];
		dealer['cards'] = new Array();
		dealer['cardsID'] = new Array();
		document.getElementById('dealerCount').style.top = dealer['pos_top_base'] - 12 + "px";
		document.getElementById('dealerCount').style.left = dealer['pos_left_base'] + "px";
		document.getElementById('dealerCount').style.display = "none";
	}
	
	// initalize the window for the first time
	function init()
	{		
		// starting values for the buttons, text areas and select fields
		document.f_status.status_games.value = "0";
		document.f_status.status_cardsleft.value = "0";
		document.f_status.status_hilo.value = "0";
		document.f_status.status_bankroll.value = g['bankroll'];

		document.f_settings.bet_one.disabled = false;
		document.f_settings.bet_two.disabled = false;
		document.f_settings.bet_three.disabled = true;
		document.f_settings.bet_four.disabled = true;
		document.f_settings.bet_one.value = 20;
		document.f_settings.bet_two.value = 0;
		document.f_settings.bet_three.value = 0;
		document.f_settings.bet_four.value = 0;

		document.f_action.button_double.disabled = true;
		document.f_action.button_split.disabled = true;
		document.f_action.button_hit.disabled = true;
		document.f_action.button_stand.disabled = true;
		document.f_action.button_deal.disabled = false;
		
		// hide the message box
		document.getElementById('msgBox').style.display = 'none';
		document.getElementById('popup').style.display = 'none';
		
		// initialize dealer
		reset_dealer();
		
		// activate
		setInterval('update_status()', 100);
		
		// welcome screen
		msgBox("Bet and deal", "halt");
	}
		
	// add a card to either the player's hand or the dealer's
	function add_card(hand)
	{
		// get the next card from the shoe
		var	cardDiv = document.getElementById('card-' + g['cID']);
		
		// if the card is supposed to go the dealer
		if (hand == "dealer")
		{
			// save the value and ID of the card onto the dealer's hand
			dealer['cards'][dealer['cards'].length] = document.getElementById('img-card-'+g['cID']).alt;
			dealer['cardsID'][dealer['cardsID'].length] = g['cID'];
			
			// reposition and make it visible
			cardDiv.style.top = dealer['pos_top'] + 'px';
			cardDiv.style.left = dealer['pos_left'] + 'px';
			cardDiv.style.display = "block";
			
			// increment the position values, so the next card doesn't stack right on top, covering the previous
			dealer['pos_top'] = dealer['pos_top'] + g['cardPosIncrementTop'];
			dealer['pos_left'] = dealer['pos_left'] + g['cardPosIncrementLeft'];
			
			// increment the value of current card ID, so we'll get a new one next time we run this function
			g['cID']++;
			
			// show total count
			var o = document.getElementById('dealerCount');
			o.innerHTML = count_cards('dealer');
			o.style.display = "block";
		}
		
		// same stuff, but for the player instead of the dealer
		else
		{
			// error handling
			if ((hand*1) > (player.length-1) || hand == null)
			{
				alert("The argument 'hand' for the add_card() does not exist in var 'player'!");
				return;
			}
			
			// moving along...
			player[hand]['cards'][player[hand]['cards'].length] = document.getElementById('img-card-'+g['cID']).alt;
			player[hand]['cardsID'][player[hand]['cardsID'].length] = g['cID'];
			
			cardDiv.style.top = player[hand]['pos_top'] + 'px';
			// if a players has chosen to double, the next card is positioned to the opposite side of the "card stairs"
			if (player[hand]['double'])
				cardDiv.style.left = (player[hand]['pos_left']-g['cardPosIncrementLeft']*2) + 'px';
			else
				cardDiv.style.left = player[hand]['pos_left'] + 'px';
			cardDiv.style.display = "block";
			player[hand]['pos_top'] = player[hand]['pos_top'] - g['cardPosIncrementTop'];
			player[hand]['pos_left'] = player[hand]['pos_left'] + g['cardPosIncrementLeft'];
			
			g['cID']++;
			
			// show total count
			var o = document.getElementById('msgBot-'+player[hand]['cardsID'][0]);
			o.innerHTML = count_cards(hand) + "<br/><br/><small>Bet: " + player[hand]['bet'] + "</small>";
		}
		
		hi_lo_count(g['cID']-1);
	}

	// Hi-Lo count ;)
	function hi_lo_count(n)
	{
		hilo_card = document.getElementById('img-card-'+n).alt;
		hilo_card = hilo_card.substr(1);
		switch(hilo_card)
		{
			case '2':
				g['hiloCount']++;
				break;
			case '3':
				g['hiloCount']++;
				break;
			case '4':
				g['hiloCount']++;
				break;
			case '5':
				g['hiloCount']++;
				break;
			case '6':
				g['hiloCount']++;
				break;
			case '7':
				break;
			case '8':
				break;
			case '9':
				break;
			case '10':
				g['hiloCount']--;
				break;
			case 'j':
				g['hiloCount']--;
				break;
			case 'q':
				g['hiloCount']--;
				break;
			case 'k':
				g['hiloCount']--;
				break;
			case 'a':
				g['hiloCount']--;
				break;
			default:
				null;
		}
	}

	// update the status text (games played, bets etc)
	function update_status(m_action)
	{	
		m_action = (m_action) ? m_action : false;
		
		document.f_status.status_bankroll.value = g['bankroll'];
		document.f_status.status_games.value = g['games_played'];
		document.f_status.status_hilo.value = g['hiloCount'].toString();
		document.f_status.status_cardsleft.value = document.f_status.status_cards_total.value - g['cID'];
	}
	
	// talk to me
	function msgBox(msg, cmd)
	{
		if (!cmd)
			cmd = false;
		
		var i;
		for (i in g['savedTimeOuts'])
			clearTimeout(g['savedTimeOuts'][i]);

		if (msg != "")
		{
			document.getElementById('popup').style.display = "block";
			document.getElementById('msgBox').style.display = "block";
			document.getElementById('msgBox').innerHTML = msg;
		}

		document.f_action.button_deal.disabled = true;
		document.f_action.button_double.disabled = true;
		document.f_action.button_split.disabled = true;
		document.f_action.button_hit.disabled = true;
		document.f_action.button_stand.disabled = true;
		
		if (cmd=="finalThing")
		{
			document.f_action.button_deal.disabled = false;
			
			document.f_settings.bet_one.disabled = false;
			document.f_settings.bet_two.disabled = false;
			if (document.f_settings.bet_two.value > 0)
			{
				document.f_settings.bet_three.disabled = false;
				if (document.f_settings.bet_three.value > 0)
					document.f_settings.bet_four.disabled = false;
			}
		}
		else if (cmd=="halt")
		{
			document.f_action.button_deal.disabled = false;
			return;
		}
		
		g['savedTimeOuts'][g['savedTimeOuts'].length] = setTimeout('removeMsgBox("' + cmd + '")', 2000);
	}
	
	// stop bothering me and let me keep playing
	function removeMsgBox(cmd)
	{
		cmd = (cmd) ? cmd : false;
		
		document.getElementById('popup').style.display = "none";
		document.getElementById('msgBox').style.display = "none";
		
		if (cmd=="halt" || cmd=="pause")
		{
			if (player.length > 0)
				check_cards(g['active_hand']);
			else
				document.f_action.button_deal.disabled = false;			
			return;
		}
		else
		{
			// if this wasn't the last hand, keep going
			if (g['active_hand'] < player.length-1)
			{
				next_hand();
			}
			// maybe it was, but the dealer has not yet played
			else if (dealer['cards'].length < 2 && cmd != "finalThing")
			{
				stand();
			}
			else
				document.f_action.button_deal.disabled = false;
		}
	}
	
	// move to the next hand
	function next_hand()
	{
		g['active_hand']++;
		update_status();
		
		highlight();
		
		check_cards(g['active_hand']);
	}
	
	// highlight active hand (argument is for whether we should only de-highlight or not)
	function highlight(cmd)
	{
		cmd = (cmd) ? cmd : false;
		
		// de-highlight all
		for (var i=0; i < player.length; i++)
			document.getElementById("img-card-" + player[i]['cardsID'][0]).style.marginBottom = "0px";
		
		// highlight active, unless we say other
		if (cmd!="no")
		{
			var o = document.getElementById("img-card-" + player[g['active_hand']]['cardsID'][0]);
			if (o)
				o.style.marginBottom = "30px";
		}
	}
	
	// count one's cards and return the result
	function count_cards(hand)
	{
		// who's cards to count (and some error handling in between)
		var cards = new Array();
		if (hand=="dealer")
			cards = dealer['cards'];
		else if ((hand*1) > (player.length-1))
		{
			alert("The argument 'hand' for the count_cards() does not exist in var 'player'!");
			return;
		}
		else
			cards = player[hand]['cards'];

		// we start off at nothing
		var total=0;
		var aces=0;
		
		// loop through each card and check the value (j k and q are considered 10's and the aces are saved for later)
		var i;
		for (i in cards)
		{
			var value = cards[i].substr(1);
			switch (value)
			{
				case 'j':
					total = (total*1) + 10;
					break;
				case 'q':
					total = (total*1) + 10;
					break;
				case 'k':
					total = (total*1) + 10;
					break;
				case 'a':
					aces++;
					break;
				default:
					total = (total*1) + (value*1);
			}
		}
		
		// check the aces
		i=aces;
		while (i)
		{
			// if we have more than one ace, for one of them to be counted as 11, the two combined should be 12 without going busted
			if (i > 1)
				(total + 12 <= 21) ? total = (total*1) + 11 : total = (total*1) + 1;
			else
				(total + 11 <= 21) ? total = (total*1) + 11 : total = (total*1) + 1;
			i--;
		}
		
		// if we have 7 to 11, created with only two cards and an ace - allow double (if the player haven't doubled already)
		if (total >= 7 && total <=11 && cards.length==2 && aces > 0 && player[hand]['double']==false)
			document.f_action.button_double.disabled = false;
		
		// return the result
		return (total*1);
	}
	
	// look whether someone's busted, has 21, is able to double, split etc...
	function check_cards(hand, finalCheck)
	{
		finalCheck = (finalCheck) ? finalCheck : false;
		
		// get player's count
		var o = document.getElementById('msgBot-'+player[hand]['cardsID'][0]);
		// o.innerHTML = count_cards(hand) + "<br/><br/><small>Bet: " + player[hand]['bet'] + "</small><br/><br/>";
		var addText = "";
		
		// get the cards total value
		var d = count_cards('dealer');
		var p = count_cards(hand);
		
		// reset the buttons
		document.f_action.button_deal.disabled = true;
		document.f_action.button_double.disabled = true;
		document.f_action.button_split.disabled = true;
		document.f_action.button_hit.disabled = false;
		document.f_action.button_stand.disabled = false;
		
		// two cards combinations (and dealer is yet to draw)
		if (player[hand]['cards'].length==2 && dealer['cards'].length < 2)
		{
			// check for black jack
			if (p==21 && d < 10)
			{
				// heads up, the game's over
				if (player.length-1 == 0)
				{
					g['bankroll'] = g['bankroll'] + player[hand]['bet'] * 2.5;
					addText = addText + "Black Jack<br/>+" + player[hand]['bet'] * 1.5;
					msgBox("Black Jack");
					return;
				}
				// but if there's more,
				// we just notice the blackjack and move along
				else
				{
					player[hand]['blackjack'] = true;
					document.f_action.button_hit.disabled = true;
				}
			}
			// if player got black jack and the dealer might get one, disable the hit button
			else if (p==21 && d > 9)
			{
				player[hand]['blackjack'] = true;
				document.f_action.button_hit.disabled = true;
			}

			// check for double (this is also done in count_cards(), where it checks for combinaton with aces)
			if (p >= 7 && p <= 11 && player[hand]['splitted']==false)
				document.f_action.button_double.disabled = false;

			// check for split
			one = player[hand]['cards'][0].substr(1);
			two = player[hand]['cards'][1].substr(1);

			if (isNaN(one) && one != 'a')
				one = 10;
			if (isNaN(two) && two != 'a')
				two = 10;

			// now, if "one" and "two" have the same value, allow the option to split
			if (one == two)
				document.f_action.button_split.disabled = false;
		}
		
		// if the player has got 21 and not a black jack and the dealer has not yet drawn, disable the hit button
		else if (p==21 && dealer['cards'].length < 2)
		{
			document.f_action.button_hit.disabled = true;
		}
		
		// busted?
		else if (p > 21)
		{
			if (finalCheck)
				addText = addText + "BUSTED<br/>-" + player[hand]['bet']
			else
				msgBox("Busted");
		}
		
		// we chose to stand <=21 and dealer has drawn
		else if (dealer['cards'].length > 1 && d > 16)
		{
			// in case we have higher (or dealer busted), there's no need for further checks
			if (p > d || d > 21)
			{
				// if blackjack, hand out more money
				if (player[hand]['blackjack']==true) {
					g['bankroll'] = g['bankroll'] + player[hand]['bet'] * 2.5;
					addText = addText + "Black Jack<br/>+" + player[hand]['bet'] * 1.5;
				}
				
				// otherwise, just twice the bet
				else {
					g['bankroll'] = g['bankroll'] + player[hand]['bet'] * 2;
					addText = addText + "WIN<br/>+" + player[hand]['bet'] * 1;
				}
			}

			// if we're even at 21
			else if (d == 21 && p == 21)
			{				
				// if dealer has blackjack (21 in 2 cards)
				if (dealer['cards'].length == 2)
				{
					// unless the player also has a blackjack (even)...
					if (player[hand]['blackjack']==true) {
						g['bankroll'] = g['bankroll'] + player[hand]['bet'] * 1;
						addText = addText + "PUSH<br/>+0";
					}
					
					// ...we lose
					else {
						addText = addText + "LOSE<br/>-" + player[hand]['bet'];
					}
				}
				
				// dealer has 21 but not blackjack (drawn more than two cards)
				else
				{	
					// if the player has blackjack, we win
					if (player[hand]['blackjack']==true) {
						g['bankroll'] = g['bankroll'] + player[hand]['bet'] * 2.5;
						addText = addText + "Black Jack<br/>+" + player[hand]['bet'] * 1.5;
					}
					// otherwise we'll be even
					else {
						g['bankroll'] = g['bankroll'] + player[hand]['bet'] * 1;
						addText = addText + "PUSH<br/>+0";
					}
				}
			}
			
			// even at 20
			else if (d == 20 && p == 20)
			{							
				g['bankroll'] = g['bankroll'] + player[hand]['bet'] * 1;
				addText = addText + "PUSH<br/>+0";
			}
			
			// even at 17,18,19
			else if (d == p)
				addText = addText + "LOSE<br/>-" + player[hand]['bet'];
			
			// else the player has lower than 16 and the dealer ain't busted
			else
				addText = addText + "LOSE<br/>-" + player[hand]['bet'];
		}

		// put some info below cards
		o.innerHTML = count_cards(hand) + "<br/><br/><small>Bet: " + player[hand]['bet'] + "</small><br/><br/>" + addText;
	}

	// new deal (game on!)
	function deal(resetDeal)
	{	
		// reset active hand to the first
		g['active_hand'] = 0;
		
		if (resetDeal)
		{	
			// what if we're broke?
			if (g['bankroll'] < 20)
			{
				msgBox("Out of money", "halt");
				var c = confirm("Do you want to borrow another 500?");
				if (c)
				{
					g['bankroll'] = g['bankroll'] + 500;
					update_status();
					msgBox("Bet and deal", "halt");
					return;
				}
				else
					return;
			}
			
			// check the bets
			var bet_one = document.f_settings.bet_one.value*1;			
			var bet_two = document.f_settings.bet_two.value*1;
			var bet_three = 0;
			var bet_four = 0;
			if (bet_two > 0) {
				if (document.f_settings.bet_three.value > 0) {
					bet_three = document.f_settings.bet_three.value*1;
					if (document.f_settings.bet_four.value > 0) {
						bet_four = document.f_settings.bet_four.value*1;
					}
				}
			}
			
			// check whether we have enough money or not
			if ((bet_one + bet_two + bet_three + bet_four)*1 > g['bankroll']) {
				msgBox("Not enough money", "halt");
				return;
			}
			
			// hide the already played cards
			for (var i = g['cID']-1; i >= 0; i--)
				document.getElementById('card-' + i).style.display = "none";
			
			// reset global variables
			g['loop_value'] = 0;
			
			// reset dealer
			reset_dealer();
			
			// delete previous hands
			while (player.pop()){null;}

			// put the money on the table!
			create_hand(0);
			player[0]['bet'] = bet_one;
			g['bankroll'] = g['bankroll'] - bet_one;
			if (bet_two) {
				create_hand(1);
				player[1]['bet'] = bet_two;
				g['bankroll'] = g['bankroll'] - bet_two;
			}
			if (bet_three) {
				create_hand(2);
				player[2]['bet'] = bet_three;
				g['bankroll'] = g['bankroll'] - bet_three;
			}
			if (bet_four) {
				create_hand(3);
				player[3]['bet'] = bet_four;
				g['bankroll'] = g['bankroll'] - bet_four;
			}

			// reset the buttons and text fields (and the betting selections)
			document.f_action.button_double.disabled = true;
			document.f_action.button_split.disabled = true;
			document.f_action.button_hit.disabled = true;
			document.f_action.button_stand.disabled = true;
			document.f_action.button_deal.disabled = true;

			document.f_settings.bet_one.disabled = true;
			document.f_settings.bet_two.disabled = true;
			document.f_settings.bet_three.disabled = true;
			document.f_settings.bet_four.disabled = true;
			
			// hide the message box
			document.getElementById('msgBox').style.display = 'none';
			document.getElementById('popup').style.display = 'none';
		}
		
		// if it's the first or third loop, hand it to the player
		if (g['loop_value'] % 2 == 0) {
			// loop all players and give them a card
			for (var i = 0; i < player.length; i++) {
				g['savedTimeOuts'][g['savedTimeOuts'].length] = setTimeout('add_card(' + i + ')', 500*(i+1));
			}
		}
		else {	// hand one to the dealer
			g['savedTimeOuts'][g['savedTimeOuts'].length] = setTimeout('add_card("dealer")', 500*(player.length));
		}
		
		// increment the loop value
		g['loop_value']++;
		
		// if we haven't looped three times, the deal is not done
		// run this function again with argument 'false', as to not reset the deal but continue
		if (g['loop_value'] < 3)
			g['savedTimeOuts'][g['savedTimeOuts'].length] = setTimeout('deal(false)', 500*(player.length));
		
		// the deal is done - let's check our results (only the first hand)
		else if (g['loop_value']==3)
		{
			g['savedTimeOuts'][g['savedTimeOuts'].length] = setTimeout('check_cards(' + g['active_hand'] + ')', 500*(player.length));
			g['loop_value']=0;
			g['savedTimeOuts'][g['savedTimeOuts'].length] = setTimeout('highlight()', 500*(player.length));
		}
	}
	
	// hit me with another one!
	function hit()
	{
		document.f_action.button_double.disabled = true;
		document.f_action.button_split.disabled = true;
		
		add_card(g['active_hand']);
		update_status();
		
		check_cards(g['active_hand']);		
	}
	
	// I rest my case
	function stand()
	{
		// if we aren't the last one to play, move along with the next hand
		if (g['active_hand'] < (player.length-1))
		{
			next_hand();
			return;
		}
		
		// disable all options, reset active hand to the first one and simply watch the dealer getting her cards...
		else
		{
			// de-highlight all
			highlight("no");
						
			// check whether all hands are busted or not
			var all_busted = true;
			var i;
			for (i in player)
				(count_cards(i) < 22) ? all_busted = false : null;
				
			if (all_busted)
			{
				document.f_action.button_double.disabled = true;
				document.f_action.button_split.disabled = true;
				document.f_action.button_hit.disabled = true;
				document.f_action.button_stand.disabled = true;
				document.f_action.button_deal.disabled = false;
				
				msgBox("All busted", "finalThing");
				
				g['games_played']++;
				return;
			}
			
			document.f_action.button_double.disabled = true;
			document.f_action.button_split.disabled = true;
			document.f_action.button_hit.disabled = true;
			document.f_action.button_stand.disabled = true;
			document.f_action.button_deal.disabled = true;
		
			// get present dealer count
			var d = count_cards('dealer');

			// "dealer must draw on 16 and stand on 17"
			if (d < 17)
			{
				// give her a card
				add_card('dealer');

				// redo this function (make dealer draw another card)
				g['savedTimeOuts'][g['savedTimeOuts'].length] = setTimeout('stand()', 1000);
			}

			// check the cards if the dealer ain't allowed more cards
			else if (d > 16)
			{
				for (var i=0; i < player.length; i++)
					check_cards(i, true); // true as in 'finalCheck'

				if (player.length-1 == 0 && player[0]['blackjack']==true)
					msgBox("", "finalThing");
				else if (dealer['cards'].length == 2 && d==21)
					msgBox("Dealer<br/>Black Jack", "finalThing");
				else if (d > 21)
					msgBox("Dealer busted", "finalThing");
				else
					msgBox("", "finalThing");

				// increment number of games played
				g['games_played']++;
				
				// warn and reset when there is only 20 cards left
				if (g['cID']+20 > document.f_status.status_cards_total.value)
				{
					alert('There are less than 20 cards left in the deck.\n\nThe Black Jack will reload and re-shuffle...');
					window.location.reload();
					return;
				}
			}
		}
	}
	
	// double me up, scotty!
	function double()
	{
		// haven't we splitted this one? (therefore not allowed to double)
		if (player[g['active_hand']]['splitted']==true)
		{
			msgBox("Not allowed to double after a split.", "pause");
			return;
		}
		
		// can we even afford to double up?
		if (player[g['active_hand']]['bet'] > g['bankroll'])
		{
			msgBox("Not enough money", "pause");
			return;
		}
		else
		{
			g['bankroll'] = g['bankroll'] - player[g['active_hand']]['bet'];
			player[g['active_hand']]['bet'] = player[g['active_hand']]['bet'] * 2;
		}
			
		player[g['active_hand']]['double'] = true;
		
		add_card(g['active_hand']);

		document.f_action.button_deal.disabled = true;
		document.f_action.button_double.disabled = true;
		document.f_action.button_split.disabled = true;
		document.f_action.button_hit.disabled = true;
		document.f_action.button_stand.disabled = true;		

		g['savedTimeOuts'][g['savedTimeOuts'].length] = setTimeout('stand()', 1000);
	}
	
	// split the cards
	function split()
	{
		// can we even afford a split?
		if (player[g['active_hand']]['bet'] > g['bankroll'])
		{
			msgBox("Not enough money", "pause");
			return;
		}
		else
			g['bankroll'] = g['bankroll'] - player[g['active_hand']]['bet'];
		
		document.f_action.button_double.disabled = true;

		create_hand(player.length);
		
		var i = player.length-1;
		
		while (i > g['active_hand']+1)
		{
			// // document.getElementById('card-' + player[newH]['cardsID'][0])

			// move the interfering hand one step to the left
			player[i]['cards'][0] = player[i-1]['cards'].shift();
			player[i]['cards'][1] = player[i-1]['cards'].shift();
			
			player[i]['cardsID'][0] = player[i-1]['cardsID'].shift();
			player[i]['cardsID'][1] = player[i-1]['cardsID'].shift();
			
			// remember the bet
			player[i]['bet'] = player[i-1]['bet'];

			// move its cards
			document.getElementById('card-' + player[i]['cardsID'][0]).style.top = player[i]['pos_top_base'] + "px";
			document.getElementById('card-' + player[i]['cardsID'][0]).style.left = player[i]['pos_left_base'] + "px";
			player[i]['pos_top'] = player[i]['pos_top'] - g['cardPosIncrementTop'];
			player[i]['pos_left'] = player[i]['pos_left'] + g['cardPosIncrementLeft'];
			document.getElementById('card-' + player[i]['cardsID'][1]).style.top = player[i]['pos_top'] + "px";
			document.getElementById('card-' + player[i]['cardsID'][1]).style.left = player[i]['pos_left'] + "px";
			player[i]['pos_top'] = player[i]['pos_top'] - g['cardPosIncrementTop'];
			player[i]['pos_left'] = player[i]['pos_left'] + g['cardPosIncrementLeft'];
			
			// make a clear spot where the interfering hand previously was
			create_hand(i-1);
		
			i--;
		}
		
		var new_id = i;
		
		// remember that we've splitted this hand and the new
		player[g['active_hand']]['splitted'] = true;
		player[new_id]['splitted'] = true;
		
		// move over one of the two into the new hand (along with the bet)
		player[new_id]['cards'][0] = player[g['active_hand']]['cards'].pop();
		player[new_id]['cardsID'][0] = player[g['active_hand']]['cardsID'].pop(); //player[new_id]['cardsID'].length
		player[new_id]['bet'] = player[g['active_hand']]['bet'];

		// re-position
		var o = document.getElementById('card-'+player[new_id]['cardsID'][0]);
		o.style.top = player[new_id]['pos_top'] + "px";
		o.style.left = player[new_id]['pos_left'] + "px";
		player[new_id]['pos_top'] = player[new_id]['pos_top'] - g['cardPosIncrementTop'];
		player[new_id]['pos_left'] = player[new_id]['pos_left'] + g['cardPosIncrementLeft'];
		
		// fix positions for the next card onto the "old hand"
		player[g['active_hand']]['pos_top'] = player[g['active_hand']]['pos_top'] + g['cardPosIncrementTop'];
		player[g['active_hand']]['pos_left'] = player[g['active_hand']]['pos_left'] - g['cardPosIncrementLeft'];

		// add one card to each new hand
		add_card(g['active_hand']);
		add_card(new_id);
		
		// update text field
		update_status();
		
		// return and check the first one
		check_cards(g['active_hand']);
	}
	
	// for debugging
	function show_dynamic_source()
	{
		var code = document.body.innerHTML;
		var win;
		win = window.open('','debuggingWin','resizable=yes,scrollbars=no,width=1150,height=650');
		win.document.body.innerHTML = "<form><textarea cols=140 rows=40 wrap=off>" + code +"</textarea></form>";
		win.focus();
	}
	
	// show the help window
	function help()
	{
		alert(	"\t\t" + "BLACK JACK" + "\n\n" +
				"\"Dealer must draw on 16 and stand on 17\"" + "\n\n" +
				"- Can only split pairs" + "\n" +
				"- Can only double 7-11" + "\n" +
				"- Can not double after a split" + "\n" +
				"- Dealer stands on soft 17" + "\n" +
				"- Dealer wins on even 17-19" + "\n\n" +
				"SPACE" + "\t\t" + "Deal" + "\n" +
				"ENTER" + "\t\t" + "Hit" + "\n" +
				"SHIFT" + "\t\t" + "Stand" + "\n" +
				"D" + "\t\t\t" + "Double" + "\n" +
				"S" + "\t\t\t" + "Split" + "\n" +
				"H" + "\t\t\t" + "Help (this pop-up)" + "\n" +
				"\n\t" + "Created by Petter Rodhelind");
	}
	
	// keyboard handling	
	function keyboard(e)
	{
		var f = document.f_action;
		var code;
		if (!e)
			var e = window.event;
		if (e.keyCode)
			code = e.keyCode;
		else if (e.which)
			code = e.which;

		// alert(code);

		switch (code)
		{
			// enter
			case 13:
				f.button_hit.focus();
				f.button_hit.blur();
				break;
			// space
			case 32:
				f.button_deal.focus();
				f.button_deal.blur();
				break;
			// shift
			case 16:
				f.button_stand.focus();
				f.button_stand.blur();
				break;
			// d
			case 68:
				f.button_double.focus();
				f.button_double.blur();
				break;
			// s
			case 83:
				f.button_split.focus();
				f.button_split.blur();
				break;
			// h
			case 72:
				help();
				break;
			// i
			case 73:
				show_dynamic_source();
				break;
			default:
				null;
		}
	}
	document.onKeydown = keyboard;
	
	// reset the whole thing upon page reload
	window.onload = init;

//-->