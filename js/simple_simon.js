$(document).ready(function() {
    'use strict';

    var sequence;
    var copy;
    var round;
    var active = true;

    //--------- Random number generator between 1 and 4

    function randomNumber() {

        return Math.floor((Math.random()*4)+1);
    }

    //---------The game is ready to be initialized by calling the initSimon function

    function initSimon() {
        $('[data-action=start]').on('click', startGame);

    }
    initSimon();

    //--------- This function starts the game by creating empty arrays for the computer generated sequence and the user sequence
    function startGame() {
        sequence = [];
        copy = [];
        round = 0;
        $('p[data-action="lose"]').hide();
        newRound();
    }

    //--------- This function will push the random number generated to the sequence array, will slice the sequence
    // index to the copy array and animate the computer generated sequence
    function newRound() {
        $('[data-round]').text(++round);
        sequence.push(randomNumber());
        copy = sequence.slice(0);
        animate(sequence);
    }

    //--------- Here, the board will be active and listening and running the registering function for the mouse clicks
    // and the behaviors assigned adding classes to the tiles and removing such classes on mouse specific behaviors

    function activateSimonBoard(){
        $('.simon')
            .on('click', '[data-tile]', registerClick)

            .on('mousedown', '[data-tile]', function(){
                $(this).addClass('active');
                playSound($(this).data('tile'));
            })

            .on('mouseup', '[data-tile]', function(){
                $(this).removeClass('active');
            });

        $('[data-tile]').addClass('hoverable');
    }

    //--------- Here the board is deactivated on the DOM object and removing the class of hoverable so the user cannot
    // interfere with the computer sequence until finished

    function deactivateSimonBoard() {

            $('.simon')
                .off('click', '[data-tile]')
                .off('mousedown', '[data-tile]')
                .off('mouseup', '[data-tile]');

            $('[data-tile]').removeClass('hoverable');

    }

    //--------- The "registerClick" function where is shifting the user input to the copy array and comparing what was
    //input by the user to the active tiles and checking if they are different.  This function is constantly checking
    // both arrays.

    function registerClick(e) {
        var desiredResponse = copy.shift();
        var actualResponse = $(e.target).data('tile');
        active = (desiredResponse === actualResponse);
        checkLose();
    }

    //--------- Copy array will be empty when user has successfully completed sequence

    function checkLose() {

        if (copy.length === 0 && active) {
            deactivateSimonBoard();
            newRound();

        } else if (!active) {
            deactivateSimonBoard();
            endGame();
        }
    }

    //--------- The function will notify the user that they lost
    function endGame() {

        $('p[data-action=lose]').show();
        $($('[data-round]')[0]).text('0');
    }


    //-------- Animate, light up and add sound to the board

    function animate(sequence) {

        var i = 0;
        var interval = setInterval(function() {
            playSound(sequence[i]);
            lightUp(sequence[i]);

            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
                activateSimonBoard();
            }
        }, 600);
    }

    function lightUp(tile) {

            $('[data-tile=' + tile + ']').animate({
                opacity: 1
            }, 250, function() {
                setTimeout(function() {
                    $('[data-tile=' + tile + ']').css('opacity', 0.6);
                }, 250);
            });
        }


    function playSound(tile) {

            var audio = $('<audio autoplay></audio>');
            audio.append('<source src="sounds/' + tile + '.ogg" type="audio/ogg" />');
            audio.append('<source src="sounds/' + tile + '.mp3" type="audio/mp3" />');
            $('[data-action=sound]').html(audio);
        }
})();