// import * as d3 from "https://cdn.skypack.dev/d3@3";
import axios from "https://cdn.skypack.dev/axios";
import * as d3 from "https://cdn.skypack.dev/d3@7";

const dataSet = async function getData() {
    return await axios.get("/api/data");
};

let parseDate = d3.isoParse;
const format = d3.timeFormat("%d-%m-%Y");
const toolDate = d3.timeFormat("%d/%b/%y");
let svg = d3.select("svg");

const title = "Perfect days";
const units = " goals achieved";
const breaks = [1, 2, 3, 4];
const colours = ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e"];

//general layout information
const cellSize = 17;
const xOffset = 20;
const yOffset = 60;
const calY = 50; //offset of calendar in each group
const calX = 25;
const width = 960;
const height = 163;

async function drawChart() {
    var data = await dataSet();

    //let svg = d3.select("svg");
    console.log(data.data);
    let dates = new Array();
    let values = new Array();

    //parse the data
    data.data.forEach(function (d) {
        dates.push(parseDate(d.date));
        values.push(d.value);
        d.date = parseDate(d.date);
        d.value = d.goal1 + d.goal2 + d.goal3 + d.goal4;
        d.year = d.date.getFullYear(); //extract the year from the data
    });

    let yearlyData = Array.from(
        d3.group(data.data, (d) => d.year),
        ([key, value]) => ({ key, value })
    );

    yearlyData.forEach((value, key) => console.log(value));
    //create an SVG group for each year
    var cals = svg
        .selectAll("g")
        .data(yearlyData)
        .enter()
        .append("g")
        .attr("id", (d) => d.key)
        .attr(
            "transform",
            (d, i) => "translate(0," + (yOffset + i * (height + calY)) + ")"
        );

    var labels = cals
        .append("text")
        .attr("class", "yearLabel")
        .attr("x", xOffset)
        .attr("y", 15)
        .text((d) => d.key);

    //create a daily rectangle for each year
    var rects = cals
        .append("g")
        .attr("id", "alldays")
        .selectAll(".day")
        .data((d) => {
            return d3.timeDay.range(
                new Date(parseInt(d.key), 0, 1),
                new Date(parseInt(d.key) + 1, 0, 1)
            );
        })
        .enter()
        .append("rect")
        .attr("id", (d) => "_" + format(d))
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr(
            "x",
            (d) =>
                xOffset +
                calX +
                d3.timeSunday.count(d3.timeYear(d), d) * cellSize
        )
        .attr("y", (d) => calY + d.getDay() * cellSize)
        .datum(format);

    //create day labels
    var days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    var dayLabels = cals.append("g").attr("id", "dayLabels");
    days.forEach(function (d, i) {
        dayLabels
            .append("text")
            .attr("class", "dayLabel")
            .attr("x", xOffset)
            .attr("y", (d) => calY + i * cellSize)
            .attr("dy", "0.9em")
            .text(d);
    });

    //let's draw the data on
    var dataRects = cals
        .append("g")
        .attr("id", "dataDays")
        .selectAll(".dataday")
        .data((d) => d.value)
        .enter()
        .append("rect")
        .attr("id", (d) => format(d.date) + ":" + d.value)
        .attr("stroke", "#fff")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr(
            "x",
            (d) =>
                xOffset +
                calX +
                d3.timeSunday.count(d3.timeYear(d.date), d.date) * cellSize
        )
        .attr("y", (d) => calY + d.date.getDay() * cellSize)
        .attr("fill", function (d) {
            if (d.value > 0) {
                return colours[d.value - 1];
            } else {
                return "#eee";
            }
        })
        .on("mouseover", function (d) {
            console.log(d);
            var sel = d3.select(this);
            sel.raise()
                .attr(
                    "y",
                    (d) => calY + d.date.getDay() * cellSize - cellSize * 0.1
                )
                .attr(
                    "x",
                    (d) =>
                        xOffset +
                        calX +
                        d3.timeSunday.count(d3.timeYear(d.date), d.date) *
                            cellSize -
                        cellSize * 0.1
                )
                .attr("width", (d) => cellSize * 1.2)
                .attr("height", (d) => cellSize * 1.2);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("y", (d) => calY + d.date.getDay() * cellSize)
                .attr(
                    "x",
                    (d) =>
                        xOffset +
                        calX +
                        d3.timeSunday.count(d3.timeYear(d.date), d.date) *
                            cellSize
                )
                .attr("width", (d) => cellSize)
                .attr("height", (d) => cellSize);
        });

    //append a title element to give basic mouseover info
    dataRects.append("title").text(function (d) {
        return toolDate(d.date) + ":\n" + d.value + units;
    });

    //add montly outlines for calendar
    cals.append("g")
        .attr("id", "monthOutlines")
        .selectAll(".month")
        .data(function (d) {
            return d3.timeMonth.range(
                new Date(parseInt(d.key), 0, 1),
                new Date(parseInt(d.key) + 1, 0, 1)
            );
        })
        .enter()
        .append("path")
        .attr("class", "month")
        .attr("transform", "translate(" + (xOffset + calX) + "," + calY + ")")
        .attr("d", monthPath);

    //retreive the bounding boxes of the outlines
    var BB = new Array();
    var mp = document.getElementById("monthOutlines").childNodes;
    for (var i = 0; i < mp.length; i++) {
        BB.push(mp[i].getBBox());
    }

    var monthX = new Array();
    BB.forEach(function (d, i) {
        var boxCentre = d.width / 2;
        monthX.push(xOffset + calX + d.x + boxCentre);
    });

    //create centred month labels around the bounding box of each month path
    //create day labels
    var months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
    ];
    var monthLabels = cals.append("g").attr("id", "monthLabels");
    months.forEach(function (d, i) {
        monthLabels
            .append("text")
            .attr("class", "monthLabel")
            .attr("x", monthX[i])
            .attr("y", calY / 1.2)
            .text(d);
    });

    //create key
    var key = svg
        .append("g")
        .attr("id", "key")
        .attr("class", "key")
        .attr("transform", function (d) {
            return (
                "translate(" + xOffset + "," + (yOffset - cellSize * 1.5) + ")"
            );
        });

    key.selectAll("rect")
        .data(colours)
        .enter()
        .append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", (d, i) => i * 60)
        .attr("fill", (d) => d);

    key.selectAll("text")
        .data(colours)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
            return cellSize + 5 + i * 60;
        })
        .attr("y", "1em")
        .text((d, i) => breaks[i]);
}

function weekOfYear(d) {
    return d3.timeSunday.count(d3.timeYear(d), d);
}

//pure Bostock - compute and return monthly path data for any year
function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(),
        w0 = weekOfYear(t0),
        d1 = t1.getDay(),
        w1 = weekOfYear(t1);
    return (
        "M" +
        (w0 + 1) * cellSize +
        "," +
        d0 * cellSize +
        "H" +
        w0 * cellSize +
        "V" +
        7 * cellSize +
        "H" +
        w1 * cellSize +
        "V" +
        (d1 + 1) * cellSize +
        "H" +
        (w1 + 1) * cellSize +
        "V" +
        0 +
        "H" +
        (w0 + 1) * cellSize +
        "Z"
    );
}
drawChart();
