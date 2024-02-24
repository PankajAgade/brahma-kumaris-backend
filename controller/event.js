const asyncHandler = require("express-async-handler");
const supabase = require("../instance/database");

exports.get_event = asyncHandler(async (req, res, next) => {

  const { event_id, page, limit=10 } = req.query;

    try {
        let eventQuery = supabase.from("event").select("*", {count: "exact"});
        
        if (event_id) {
            eventQuery = eventQuery.eq("event_id", event_id).maybeSingle();
        } else if(page) {
            const fromRange = (limit * page) - limit;
            const toRange   = (limit * page) - 1;
            eventQuery = eventQuery.range(fromRange, toRange);
        }
        
        const eventQueryResponse = await eventQuery;
        
        if (eventQueryResponse.data) {
            let sendData = {...eventQueryResponse};
            delete sendData.error;

            res.status(200).json(sendData);
        } else {
            throw eventQueryResponse.error;
        }
    } catch (error) {
        console.error("error -> ", error);
        res.status(500).json(error?.message || error || "something went wrong please try again");
    }
});

// header_image
exports.create_event = asyncHandler(async (req, res, next) => {
    const { title, description, start_date_time, end_date_time } = req.body;
    if (title && description && start_date_time && end_date_time) {
        try {
            const createEventResponse = await supabase.from("event").insert({title, description, start_date_time, end_date_time}).select("*").maybeSingle();
            if (createEventResponse?.data) {
                res.status(200).json(createEventResponse?.data);
            } else {
                throw createEventResponse?.error;
            }
        } catch (error) {
            console.error("error -> ", error);
            res.status(500).json(error?.message || error || "something went wrong please try again");
        }
    } else {
        res.status(500).json("Please send valid body.");
    }
});

exports.register_event = asyncHandler(async (req, res, next) => {
    const { user_name, user_phone, user_email, number_people } = req.body;
    if (user_name && user_phone && user_email && number_people) {
        try {
            const createRegisterEventResponse = await supabase.from("event-users").insert({user_name, user_phone, user_email, number_people}).select("*").maybeSingle();
            if (createRegisterEventResponse?.data) {
                res.status(200).json(createRegisterEventResponse?.data);
            } else {
                throw createRegisterEventResponse?.error;
            }
        } catch (error) {
            console.error("error -> ", error);
            res.status(500).json(error?.message || error || "something went wrong please try again");
        }
    } else {
        res.status(500).json("Please send valid body.");
    }
});