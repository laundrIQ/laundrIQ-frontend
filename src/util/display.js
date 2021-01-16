import moment from "moment";

const calFormat = { sameElse: "L [at] LT" };

const getPrettyTimeRelative = (earliest, latest) => {
    const earliest_str = moment(earliest).fromNow(true);
    const latest_str = moment(latest).fromNow(true);
    let earliest_split = earliest_str.split(" ");
    let latest_split = latest_str.split(" ");
    let suffix = "";

    if (earliest_str === latest_str) {
        return `~ ${earliest_str}`;
    }
    // this is for when the earliest possible free-time has already passed
    else if (moment(earliest).isBefore()) {
        // both our estimates failed
        if (moment(latest).isBefore() || latest_str === "a few seconds") {
            return "~ a few minutes";
        }
        return `~ ${latest_str}`;
    }

    if (earliest_split[1].endsWith("s")) {
        suffix = earliest_split[1];
        earliest_split[1] = earliest_split[1].slice(0, -1);
    }
    if (latest_split[1].endsWith("s")) {
        suffix = latest_split[1];
        latest_split[1] = latest_split[1].slice(0, -1);
    }

    if (suffix) {
        earliest_split[0] = earliest_split[0].replace(/\ban?\b/gi, "1");
        latest_split[1] = latest_split[1].replace(/\ban?\b/gi, "1");
    }

    let final_str;
    // both estimates are in the same unit (hour, minute, etc)
    if (earliest_split[1] === latest_split[1]) {
        final_str = `${earliest_split[0]} ~ ${latest_split[0]} ${suffix}`;
    } else {
        final_str = `${earliest_str} ~ ${latest_str}`;
    }

    return final_str;
};

const getPrettyTimeCalendar = (earliest, latest) => {
    const earliest_str = moment(earliest).calendar(null, calFormat);
    const latest_str = moment(latest).calendar(null, calFormat);
    let earliest_split = earliest_str.split(" at ");
    let latest_split = latest_str.split(" at ");

    if (earliest_str === latest_str) {
        return `${earliest_split[0]} around ${earliest_split[1]}`;
    }
    // this is for when the earliest possible free-time has already passed
    else if (moment(earliest).isBefore()) {
        return `${latest_split[0]} around ${latest_split[1]}`;
    }

    let final_str = "";
    if (earliest_split[0] === latest_split[0]) {
        final_str = `${earliest_split[0]} between ${earliest_split[1]} and ${latest_split[1]}`;
    } else {
        final_str = `${earliest_str} ~ ${latest_str}`;
    }

    return final_str;
};

export default {
    getPrettyTimeRelative,
    getPrettyTimeCalendar
}