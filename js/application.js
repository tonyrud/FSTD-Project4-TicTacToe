(function ($) {
    'use strict';

    /*=========================
         Variables
    ========================== */

    //DOM var
    let $playersHighlight = $('.players'),
        $boxes = $('.boxes'),
        $winScreen = $('#finish'),
        $playerOneName = $('.player1-name'),
        $playerTwoName = $('.player2-name'),
        $playerOneInput = $('#player1-input'),
        $playerTwoInput = $('#player2-input'),

        //script var
        winConditions = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [7, 5, 3]
        ],
        turns = 0,
        animationDuration = 350,
        playAI = false;

    $winScreen.hide();

    /*-----------------------
          Event handlers
    -----------------------*/

    //start screen event
    $('.screen-start a').on('click', function (e) {
        e.preventDefault();

        //input values
        let inputs = getInputs($playerOneInput, $playerTwoInput);

        $('.screen').fadeOut(animationDuration);
        $playersHighlight.first().addClass('active');

        //check if AI button was clicked
        if ($(this).html().indexOf('AI') >= 0) {
            playAI = true;
            $('.name').hide();
        } else {
            $playerOneName.html(inputs.player1);
            $playerTwoName.html(inputs.player2);
        }
    });

    //hover event 
    $boxes.on('mouseenter', 'li', function (e) {
        let $current = $(this)
        //check if empty
        if (!$current.attr('data-move')) {
            if ($('#player1').hasClass('active')) {
                $current.addClass('hoverO');
            } else {
                $current.addClass('hoverX');
            }
        }
    });

    $boxes.on('mouseleave', 'li', function (e) {
        $(this).removeClass('hoverO hoverX');
    });

    //click on boxes event
    $boxes.on('click', 'li', function (e) {

        if (isAvailableField($(this))) {
            // debugger
            if ($('#player1').hasClass('active')) {
                doMove($(this), 'box-filled-1');
            } else {
                doMove($(this), 'box-filled-2');
            }

            turns++;
            checkVictory();
            if (playAI) {
                setTimeout(function () {
                    doAiTurn();
                }, 450);
            }
        }
    });

    //reset game
    $winScreen.on('click', ".button", function () {
        $playersHighlight.removeClass('active');
        $playersHighlight.first().addClass('active');
        $('.boxes .box').attr('data-move', '');
        $('.box').removeClass('box-filled-1 box-filled-2');
        $winScreen.fadeOut(animationDuration);
        turns = 0;
    });

    let getInputs = (name1, name2) => {
        return {
            player1: name1.val(),
            player2: name2.val()
        }
    }


    //check if this box is empty
    let isAvailableField = ($this) => !$this.attr('data-move');

    //add data move 
    function doMove($this, move) {
        $this.attr('data-move', move);
        $this.addClass(move);
        $playersHighlight.toggleClass('active');
    };

    function doAiTurn() {
        let found = false;
        while (!found) {
            let random = Math.floor(Math.random() * 9),
                field = $('.box').eq(random);
            console.log(random);
            if (isAvailableField(field)) {
                found = true;
                doMove(field, 'box-filled-2');
                turns++;
                checkVictory();
            }
        }
    }

    function checkVictory() {
        //skip check if turns less than 5
        if (turns < 5) {
            return;
        }

        if (hasWon('box-filled-1')) {
            gameEnd("o");
        } else if (hasWon('box-filled-2')) {
            gameEnd("x");
        }

        if (turns === 9) {
            gameEnd();
        }
    };

    //loop through win array and compare to data in each box
    function hasWon(move) {
        for (var i = 0; i < winConditions.length; ++i) {
            var line = winConditions[i];
            var j = 0;
            for (; j < line.length; ++j) {
                var num = line[j];
                if ($('.box').eq(num - 1).attr('data-move') != move) {
                    break;
                }
            }
            if (j == line.length) {
                return true;
            }
        }
    };

    function gameEnd(winner) {
        let winnerName = getInputs($playerOneInput, $playerTwoInput);
        $winScreen.removeClass('screen-win-one screen-win-two screen-win-tie');
        if (winner === 'o') {
            $winScreen.addClass('screen-win-one');
            $('.message').html(winnerName.player1 + ' Wins!');
        } else if (winner === 'x') {
            // debugger
            $winScreen.addClass('screen-win-two');
            if (playAI) {
                $('.message').html('You lost to Javascript :(');
            } else {
                $('.message').html(winnerName.player2 + ' Wins!');
            }
        } else {
            $winScreen.addClass('screen-win-tie');
            $('.message').html('Draw');
        }
        $winScreen.fadeIn(animationDuration);
    }

})(jQuery);