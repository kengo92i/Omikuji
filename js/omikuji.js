/**
 * Omikuji.js
 * Copyright (c) 2017 kengo92i
 */

(function(global) {

    "use strict";
    
    var omikuji = omikuji || {};

    const MIN = 1;
    const MAX = 21;

    /**
     * 指定された進捗みくじの番号を元にファイル名を取得する
     * @param {Number} num 10進数の正の整数
     * @return {String} 進捗みくじのファイル名
     */
    function getOmikujiFilename(num) {
        return hex(num) + '.png';
    }

    /**
     * 指定された数字を16進数表記にして返す
     * 変換できる数字の範囲は 0x00 ~ 0xff までをサポート
     * @param {Number} num 変換する数字
     * @return {String} 16進数表記の数字を表す文字列
     */
    function hex(num) {
        var hexNum = num.toString(16);
        return "0x" + (("0" + hexNum).substr(-2));
    }

    /**
     * 適当な進捗みくじの番号を返す
     * @return {Number} 進捗みくじの番号
     */
    var randomInt = function () {
        return Math.floor( Math.random() * (MAX - MIN + 1) + MIN );
    }

    /**
     * 指定された番号の進捗みくじを表示する
     * @param {Number} num 進捗みくじの番号
     * @param {String} tagName 表示するタグ名
     */
    var showOmikuji = function (num, tagName) {
        var omikuji = '<img src="images/omikuji/png/' + getOmikujiFilename(num) + '"/>';
        $(tagName).append(omikuji);
    }

    /**
     * クエリ文字列から進捗みくじの番号を得る
     * 番号の取得に問題があれば0を返す（不正な番号・指定されていない）
     * @return {Number} 進捗みくじの番号
     */
    var getOmikujiNumber = function () {
        var vars = [];
        var url = window.location.search;

        var hash = url.slice(1).split('&');
        var n = hash.length;
        for (var i = 0; i < n; ++i) {
            var tmp = hash[i].split('=');
            vars.push(tmp[0]);
            vars[tmp[0]] = tmp[1];
        }

        var num = Number.parseInt(vars['num']);
        return isValid(num) ? num : 0;
    }

    /**
     * 有効な進捗みくじ番号が指定されているか？
     * @param {Number} num 進捗みくじ番号
     * @return {Boolean} 有効な番号か示す真偽値
     */
    function isValid(num) {
        if (typeof num == "undefined") {
            return false;
        } 
        return (MIN <= num && num <= MAX);
    }

    /**
     * 進捗みくじ番号に対応する運勢を取得
     * @param {Number} num 進捗みくじ番号
     * @return {String} 進捗みくじの運勢を示す文字列
     */
    function getFortune(num) {
        var res = [
            "存在しない進捗",
            "大進捗", "小進捗", "進捗", "末進捗", "小進捗", "停滞", "中進捗", "中進捗", "小進捗", "大進捗",
            "末進捗", "停滞", "大停滞", "小進捗", "大進捗", "末進捗", "小進捗", "小進捗", "停滞", "進捗",
            "末進捗"
        ];
        return res[num]
    }

    /**
     * twitterボタン用の進捗みくじ画像のURLを取得
     * @param {Number} num 進捗みくじ番号
     * @return {String} 進捗みくじ画像のURL
     */
    function getImgUrl(num) {
        var urls = [
            "pic.twitter.com/XB7pKKVp5r",
            "pic.twitter.com/zdqC1b3E61",
            "pic.twitter.com/ar1FAT4ed1",
            "pic.twitter.com/eid9XEJuHg",
            "pic.twitter.com/67PwAeNAmf",
            "pic.twitter.com/gVp8aIIN4n",
            "pic.twitter.com/9C5HsHehpH",
            "pic.twitter.com/w29pTpG0MY",
            "pic.twitter.com/fg7YcynDpq",
            "pic.twitter.com/nQXDZBCMra",
            "pic.twitter.com/sO9QMsY0wy",
            "pic.twitter.com/6W3bT5qY9Q",
            "pic.twitter.com/BNy1Ktyip4",
            "pic.twitter.com/Cg4EBRYNcp",
            "pic.twitter.com/AeWgr5G4ia",
            "pic.twitter.com/5iga50bjpx",
            "pic.twitter.com/0ywQpS3TNG",
            "pic.twitter.com/BWcWKJAa9N",
            "pic.twitter.com/tzMJC5wAS3",
            "pic.twitter.com/jy4G522Eg5",
            "pic.twitter.com/n4Xl0duznc",
            "pic.twitter.com/gpaBjeKIpq"
        ];
        return urls[num]
    }

    /**
     * 表示中の進捗みくじに合わせたtwitterボタンを作成する
     * @param {Number} num 表示中の進捗みくじ番号
     */
    var createTwitterButton = function (num) {
        var fortune = getFortune(num);
        var imgUrl = getImgUrl(num);
        var html = '<a class="twitter btn btn-twitter" href="http://twitter.com/share?url=https://goo.gl/ljRHk8&text=【進捗みくじ】私の今年の運勢は「' + fortune + '」でした。2017年の進捗具合を占おう！' + imgUrl + '&hashtags=進捗みくじ" target="_blank">ツイートする</a>';
        $('#share-button').append(html);
    }

    /**
     * 表示中のおみくじの前後に移動するページネーションを更新する
     * 一つ前は '.omikuji-prev' 、一つ先は '.omikuji-next' をタグに設定する
     * 前後が不正な番号になる場合は、ボタンをdisabledに設定する
     * 存在しない進捗みくじだった場合は、前をdisabledに、次を0x01に設定している
     * @param {Number} num 表示中の進捗みくじ番号
     */
    var updatePagenation = function (num) {
        var prev_n = num - 1;
        if (isValid(prev_n)) {
            $('.omikuji-prev').attr('href', `result.html?num=${prev_n}`);
            $('.omikuji-prev').text('◀︎ ' + hex(prev_n));
        } else {
            disabledButton('.omikuji-prev');
        }

        var next_n = num + 1;
        if (isValid(next_n)) {
            $('.omikuji-next').attr('href', `result.html?num=${next_n}`);
            $('.omikuji-next').text(hex(next_n) + ' ▶︎');
        } else {
            disabledButton('.omikuji-next');
        }
    }

    /**
     * 指定されたボタンをdisabledにする
     * @param {String} name ボタンの識別子
     */
    function disabledButton(name) {
        $(name).attr('aria-disabled', "true");
        $(name).addClass('disabled');
        $(name).text('...');
    }

    omikuji = {
        randomInt : randomInt,
        showOmikuji : showOmikuji,
        getOmikujiNumber : getOmikujiNumber,
        updatePagenation : updatePagenation,
        createTwitterButton : createTwitterButton
    };

    global.omikuji = omikuji;

    return omikuji;
}(window));
