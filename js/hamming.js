function encryption() {
    var value, binValue, numberOfControlPoints, place = [];
    clear();
    value = Number(document.getElementById('forEncryption').value);
    // Translations into binary system
    binValue = value.toString(2);
    // Split and reverse String !(without join)
    binValue = (String(binValue)).split("").reverse();
    numberOfControlPoints = findControlPoints(binValue.length);
    rewrite("Число в бинарном виде:", binValue.join(""), "Длина: ", binValue.length, "Кол-во контрольных бит: ", numberOfControlPoints);
    // Add control characters
    for (var i = 0; i < numberOfControlPoints; i++) {
        var current = Math.pow(2, i) - 1;
        place.push(current);
        binValue.splice(current, 0, '0');
    }
    rewrite("Число с контр-ми битами в виде 0: ", binValue.join(""));
    for (var m = 0; m < place.length; m++) {
        var arrayForConcat = [];
        for (var i = place[m]; i < binValue.length; i += (place[m] + 1) * 2) {
            var array = binValue.slice(i, i + place[m] + 1);
            arrayForConcat = arrayForConcat.concat(array);
        }
        rewrite(" ", (m + 1), " массив для проверки: ", arrayForConcat.join(""));
        var sum = 0;
        arrayForConcat.forEach(function(value) { sum += Number(value); });
        binValue[place[m]] = sum & 1; // even parity
    }
    rewrite("Закодированное число   : ", binValue.join(""));
    let b = window.baffle('#output').start();
}

function decryption() {
    var binValue, numberOfControlPoints, place = [],
        valueOfControlPoints = [],
        valueForCheckControlPoints = [],
        errorPlace = 0;
    clear();
    binValue = document.getElementById('forDecryption').value;
    // Split String !(without join and reverse)
    binValue = String(binValue).split("");
    numberOfControlPoints = findControlPoints(binValue.length);
    rewrite("Число в бинарном виде:", binValue.join(""), "Длина: ", binValue.length, "Кол-во контрольных бит: ", numberOfControlPoints);
    // Get control characters
    for (var i = 0; i < numberOfControlPoints; i++) {
        var current = Math.pow(2, i) - 1;
        place.push(current);
        valueOfControlPoints[i] = binValue[current];
        rewrite("Контрольный бит: ", valueOfControlPoints[i]);
    }
    for (var m = 0; m < place.length; m++) {
        var arrayForConcat = [];
        for (var i = place[m]; i < binValue.length; i += (place[m] + 1) * 2) {
            var array = binValue.slice(i, i + place[m] + 1);
            arrayForConcat = arrayForConcat.concat(array);
        }
        rewrite(" ", (m + 1), " массив для проверки: ", arrayForConcat.join(""));
        var sum = 0;
        // except first - control bit
        for (var g = 1; g < arrayForConcat.length; g++) {
            sum += Number(arrayForConcat[g]);
        }
        valueForCheckControlPoints[m] = sum & 1;
        rewrite("Контрольный бит должен быть равен: ", valueForCheckControlPoints[m]);
        console.log(valueForCheckControlPoints[m]);
        console.log(valueOfControlPoints[m]);
        if (valueForCheckControlPoints[m] != valueOfControlPoints[m]) {
            console.log("place:");
            console.log(place[m] + 1);
            errorPlace = errorPlace + place[m] + 1;
            console.log("error:" + errorPlace);
        }
        if (errorPlace == 0) {
            rewrite("Ошибок не обнаружено!");
        } else {
            rewrite("Ошибка в числе под номером: " + errorPlace);
        }
    }
}

function findControlPoints(length) {
    // Calculate the number of control characters
    // r = n - k = [log{(k + 1 +[log(k + 1)]}]
    var numberOfControlPoints = Math.round(Math.log2(length + 1 + Math.round(Math.log2(length + 1))));
    return numberOfControlPoints;
}

function rewrite() {
    for (var j = 0; j < arguments.length; j++) {
        var textOut = document.getElementById('output').value;
        if ((j + 1) % 2 == 0) {
            document.getElementById('output').value = textOut + arguments[j] + "\n";
        } else {
            document.getElementById('output').value = textOut + arguments[j];
        }
    }
}

function clear() {
    document.getElementById('output').value = '';
}
