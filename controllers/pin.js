function getPin() {
    let pin = Math.round(Math.random() * 226000);
    let pinStr = pin + '';
    // make sure that number is 4 digit
    if (pinStr.length == 4) {
        return pinStr;
       } else {
        return getPin();
       }
    }


    // const dates = [];
    // const days = 7
    // for (let i = 0; i < days; i++) {
    //     let date = moment();
    //     date.subtract(i, 'days').startOf("day").format('DD-MM-YYYY');
    //     dates.push({date: {year: new Date(date).getFullYear(), month: new Date(date).getMonth()+1, day: new Date(date).getDate()}, count: 1});
    //   }

    // let actualData = [
    //     { date: { year: 2022, month: 1, day: 1 }, count: 1 },
    //     { date: { year: 2022, month: 1, day: 31 }, count: 1 },
    //     { date: { year: 2022, month: 1, day: 30 }, count: 5 },
    //     { date: { year: 2022, month: 1, day: 28 }, count: 1 },
    //     { date: { year: 2022, month: 1, day: 27 }, count: 4 }
    //   ]
      
    //   let generatedDate = [
    //     { date: { year: 2022, month: 1, day: 2 }, count: 0  },
    //     { date: { year: 2022, month: 1, day: 1 }, count: 0 } ,
    //     { date: { year: 2022, month: 1, day: 31 }, count: 0 },
    //     { date: { year: 2022, month: 1, day: 30 }, count: 0 },
    //     { date: { year: 2022, month: 1, day: 29 }, count: 0 },
    //     { date: { year: 2022, month: 1, day: 28 }, count: 0 },
    //     { date: { year: 2022, month: 1, day: 27 }, count: 0  }
    //   ]
      
    //   const sameDay = (a, b) => a.date.day == b.date.day
      
    //   const compare = (a, b, compareFunction) =>
    //     a.filter(leftValue =>
    //       !b.some(rightValue =>
    //         compareFunction(leftValue, rightValue)));
      
    //   const onlyInGeneratedDate = compare(generatedDate, actualData, sameDay);
    //   const onlyInActualData = compare(actualData, generatedDate, sameDay)
      
      // console.log(...onlyInGeneratedDate)
    //   actualData.push(...onlyInGeneratedDate);
    //   console.log([...actualData.sort((a, b) => a.date.day - b.date.day)])

module.exports = { getPin }