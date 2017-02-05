(function ($) {
    'use strict';

    /*=========================
         Variables
    ========================== */

    //DOM var
    let $playersHighlight = $('.players'),
        $boxes = $('.boxes'),

        //script var
        winConditions = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [1, 5, 9],
            [7, 5, 3]
        ],
        turns = 0;




    /*-----------------------
          Event handlers
    -----------------------*/

    //start screen event
    $('.screen-start a').on('click', function (e) {
        e.preventDefault();
        $('.screen').fadeOut(500);
        $playersHighlight.first().addClass('active');
    });

    //hover event 
    $boxes.on('mouseenter', 'li', function (e) {
        let $current = $(this)
        // $current.css('background-image', 'none')
        //check if empty
        if (!$current.attr('data-move')) {
            if ($('#player1').hasClass('active')) {
                console.log('show O')
                $current.addClass('hoverO fadeBG')
            } else {
                console.log('show X')
                $current.addClass('hoverX')
            }
        }
    });

    $boxes.on('mouseleave', 'li', function (e) {
        let $current = $(this)
        $current.removeClass('hoverO hoverX')
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
            // doAiMove();
        }
        console.log(turns)

    });


    //check if this box is empty
    function isAvailableField($this) {
        return !$this.attr('data-move');
    };

    //add data move 
    function doMove($this, move) {
        $this.attr('data-move', move);
        $this.addClass(move);
        $playersHighlight.toggleClass('active');
    };

    function checkVictory() {
        //skip check if turns less than 5
        if (turns < 5) {
            return;
        }

        if (hasWon('box-filled-1')) {
            won();
        } else if (hasWon('box-filled-2')) {
            lost();
        } else if (turns === 9) {
            draw();
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
            console.log(`line length is ${line.length} and win is ${j}`);
            if (j == line.length) {
                return true;
            }
        }
    };

    function won() {
        console.log('Won!')
    }

    function lost() {
        console.log('Lost :(')
    }

    function draw() {
        console.log('Draw')
    }


})(jQuery);