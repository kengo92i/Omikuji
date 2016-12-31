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
    var getOmikujiFilename = function (num) {
        var hexNum = parseInt(num).toString(16);
        var filename = "0x" + (("0" + hexNum).substr(-2));
        return filename + '.png';
    }

    /**
     * 適当な進捗みくじの番号を返す
     * @return {Number} 進捗みくじの番号
     */
    var randomInt = function () {
        return Math.floor( Math.random() * (MAX - MIN + 1) ) + MIN;
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

        return vars['num'] === undefined ? 1 : vars['num'];
    }

    /**
     * 有効な進捗みくじ番号が指定されているか？
     * @param {Number} num 進捗みくじ番号
     * @return {Boolean} 真偽値
     */
    function isValid(num) {
        // todo: エラー処理
    }

    function getFortune(num) {
        var res = [
            "大進捗", "小進捗", "進捗", "末進捗", "小進捗", "停滞", "中進捗", "中進捗", "小進捗", "大進捗",
            "末進捗", "停滞", "大停滞", "小進捗", "大進捗", "末進捗", "小進捗", "小進捗", "停滞", "進捗",
            "末進捗"
        ];
        return res[num-1]
    }

    function getImgUrl(num) {
        var urls = [
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
        return urls[num-1]
    }

    var createTwitterButton = function (num) {
        var n = parseInt(num);
        var fortune = getFortune(n);
        var imgUrl = getImgUrl(n);
        var html = '<a class="twitter btn btn-twitter" href="http://twitter.com/share?url=[共有したいURL]&text=【進捗みくじ】私の今年の運勢は「' + fortune + '」でした。2017年の進捗具合を占おう！' + imgUrl + '&hashtags=進捗みくじ" target="_blank">ツイートする</a>';
        $('#share-button').append(html);
    }

    omikuji = {
        randomInt : randomInt,
        showOmikuji : showOmikuji,
        getOmikujiNumber : getOmikujiNumber,
        createTwitterButton : createTwitterButton
    };

    global.omikuji = omikuji;

    return omikuji;
}(window));