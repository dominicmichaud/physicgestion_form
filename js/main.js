
//Global variables
$globalVars = {
    next_index: 0,
    current_index: 0,
    prev_index: 0,
    current_percent: 0,
    slider: "",
    validate_class: '.carousel-item.active.validate-',
    pass_valid: true,
    errorHandler: $('.state_handler'),
    errorContainer: $('.state_handler .messages'),
    errorMessage: $('.state_handler .messages p')
};

$(function () {
    //If PC, remove Antialiasing for Fonts
    if (navigator.userAgent.indexOf('Mac OS X') == -1) {
        $("body").removeClass("antialiasing");
    }

    //Masked input init
    $('.phone-mask').mask('(000) 000-0000');
    $('#user_zip').mask('A0A 0A0');

    //Datepicker init    
    var year_range = "1960:" + new Date().getFullYear().toString();
    console.log(year_range);
    $("#user_birth").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd/mm/yy",
        yearRange: year_range
    });

    //Multiselect init
    var selected_objectives = '';
    $('#which_objective').multiselect({
        buttonClass: 'btn btn-info form-control multi-objective',
        buttonContainer: '<div class="btn-group" />',
        buttonWidth: '100%',
        buttonText: function (options, select) {
            if (options.length === 0) {
                return 'Aucune option de sélectionnée ...';
            }
            else {
                return options.length + ' sélectionnés';
            }
        },
        selectedClass: 'active',
        onDropdownHidden: function (event) {
            selected_objectives = $('button.multi-objective').attr('title');
            $('#which_objective_hidden').val(selected_objectives);
        }
    });

    var selected_physical = '';
    $('#physical_championship').multiselect({
        buttonClass: 'btn btn-info form-control multi-physical',
        buttonContainer: '<div class="btn-group" />',
        buttonWidth: '100%',
        buttonText: function (options, select) {
            if (options.length === 0) {
                return 'Aucune option de sélectionnée ...';
            }
            else {
                return options.length + ' sélectionnés';
            }
        },
        selectedClass: 'active',
        onDropdownHidden: function (event) {
            selected_physical = $('button.multi-physical').attr('title');
            $('#physical_championship_hidden').val(selected_physical);
        }
    });

    var selected_traning = '';
    $('#training_which').multiselect({
        buttonClass: 'btn btn-info form-control multi-training',
        buttonContainer: '<div class="btn-group" />',
        buttonWidth: '100%',
        buttonText: function (options, select) {
            if (options.length === 0) {
                return 'Aucune option de sélectionnée ...';
            }
            else {
                return options.length + ' sélectionnés';
            }
        },
        selectedClass: 'active',
        onDropdownHidden: function (event) {
            selected_traning = $('button.multi-training').attr('title');
            $('#training_which_hidden').val(selected_traning);
        }
    });

    //Form section slider init
    $globalVars.slider = $(".carousel").carousel({
        interval: false,
        keyboard: false,
        ride: false,
        wrap: false
    });

    //Slider next prev events
    $(".nav-next").on("click", function () {
        //Validate sections with required fields
        if (validate_section($globalVars.current_index)) {
            $globalVars.slider.carousel("next");
        }
    });

    $(".nav-prev").on("click", function () {
        $globalVars.slider.carousel("prev");
    });

    //Slider: after slided transition event
    $(".carousel").on("slide.bs.carousel", function (evt) {
        //Call progress bar update function
        $globalVars.current_index = evt.to;
        if (evt.direction == "left") {
            $globalVars.prev_index = evt.from;
            $globalVars.next_index = evt.to;
            updateProgress(parseInt($globalVars.next_index));
        } else {
            $globalVars.prev_index = evt.to;
            $globalVars.next_index = evt.from;
            updateProgress(parseInt($globalVars.prev_index));
        }
    });

    // onchange for weight
    $('select#weightOption').on('change', function () {
        var weightValue = $("input#user_weight").val();

        if ($(this).val() == "") {
            resetIMC();
        } else {
            weightConverter(weightValue);
            calculate_imc();
        }
    });

    $('input#user_weight').on('change', function () {
        var weightValue = $(this).val();

        if (weightValue == "") {
            resetIMC();
        } else {
            weightConverter(weightValue);
            calculate_imc();
        }
    });

    // onchange for height
    $('select#heightOption').on('change', function () {
        var heightValue = $("input#user_height").val();

        if ($(this).val() == "") {
            resetIMC();
        } else {
            heightConverter(heightValue);
            calculate_imc();
        }
    });

    $('input#user_height').on('change', function () {
        var heightValue = $(this).val();

        if (heightValue == "") {
            resetIMC();
        } else {
            heightConverter(heightValue);
            calculate_imc();
        }
    });

    //Window resize event
    window.onresize = myResize;
    myResize();
});


//Browser resize event
function myResize() {
    var bWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || window.width();
    var bHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || window.height();
}

//Update progress bar after each slide transition
function updateProgress(nextIndex) {
    //Check to see if we came back to the first step
    if (nextIndex == 0) {
        //If true, we set our progress to 0%
        $globalVars.current_percent = 0;
    } else {
        //Else we update the progress bar
        $globalVars.current_percent = 10 * nextIndex;
    }

    //Update progress bar width property
    $(".progress-bar").css({
        width: $globalVars.current_percent + "%"
    });
}

//Validate required fields and display error message to user
function validate_section(index) {
    //We make sure the current section exists and has the validate class
    if ($($globalVars.validate_class + index).length > 0) {
        $globalVars.pass_valid = true;
        //Loop each field with the required class
        $($globalVars.validate_class + index + ' .required').each(function () {
            //if one of them don't have the valid class, we warn the user and pinpoint the error
            if (!$(this).hasClass('valid')) {
                $(this).addClass('invalid');
                handleResponse('Veuillez remplir les champs obligatoires (*)', 'bg-danger');
                $globalVars.pass_valid = false;
                return false;
            }
        });

        //The last section is different, we need to make sure that at least one of the checkboxes is checked
        if (index === 9) {
            if ($($globalVars.validate_class + index + ' input[type=checkbox]').is(':checked')) {
                return true;
            }
            else {
                handleResponse("Veuillez cocher au moins l'une des options", 'bg-danger');
                $globalVars.pass_valid = false;
                return false;
            }
        }

        //if no errors and valid, the slider advances without problem
        if ($globalVars.pass_valid) {
            return true;
        }
    }
    else {
        //if the current section index doesn't need to be validated, the slider advances without problem
        return true;
    }
}

//Display state message
function handleResponse(msg, state) {
    $globalVars.errorContainer.addClass(state);
    $globalVars.errorMessage.html(msg);
    $globalVars.errorHandler.addClass('on');

    setTimeout(function () {
        $globalVars.errorHandler.removeClass('on');

        setTimeout(function () {
            $globalVars.errorContainer.removeClass(state);
            $globalVars.errorMessage.html('');
        }, 500)
    }, 3000);
}

function weightConverter(valNum) {
    var numOption = document.getElementById("weightOption").value;
    var converted_value;

    if (numOption === "lbs") {
        $("#outputKilograms").html((parseInt(valNum) / 2.2046).toFixed(3));
        converted_value = (parseInt(valNum) / 2.2046).toFixed(3);
    } else if (numOption === "kg") {
        $("#outputKilograms").html(parseInt(valNum));
        converted_value = valNum;
    }

    $('input[type=hidden]#weight_conversion').val(converted_value);
}

function heightConverter(valNum) {
    var height = document.getElementById("heightOption").value;
    var converted_value;

    if (height === "metre") {
        $("#meterOutput").html(valNum);
        converted_value = valNum;
    } else if (height === "pied") {
        $("#meterOutput").html((parseInt(valNum) / 3.2808).toFixed(3));
        converted_value = (parseInt(valNum) / 3.2808).toFixed(3);
    }

    $('input[type=hidden]#height_conversion').val(converted_value);
}

function calculate_imc() {
    if ($("#meterOutput").text() !== "" && $("#outputKilograms").text() !== "") {
        var heightValue = parseFloat($("#meterOutput").text());
        var weightValue = parseFloat($("#outputKilograms").text());
        var calculatedIMC = weightValue / (heightValue * 2);
        $("#imcResult").text(calculatedIMC);
        $('input[type=hidden]#imc-result-value').val(calculatedIMC);
    }
}

function resetIMC() {
    $("#imcResult").text("");
    $('input[type=hidden]#imc-result-value').val("-1");
}

// function multiplyBy() {
//     num1 = document.getElementById("firstNumber").value;
//     num2 = document.getElementById("secondNumber").value;
//     document.getElementById("result").innerHTML = num1 * num2;
// }
//
// function divideBy()
// {
//     num1 = document.getElementById("firstNumber").value;
//     num2 = document.getElementById("secondNumber").value;
//     document.getElementById("result").innerHTML = num1 / num2;
// }