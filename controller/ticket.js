const asyncHandler = require("express-async-handler");
const supabase = require("../instance/database");

exports.get_ticket = asyncHandler(async (req, res, next) => {

  const { ticket_id, page, limit=10 } = req.query;

    try {
        let ticketquery = supabase.from("ticket").select("*", {count: "exact"});
        
        if (ticket_id) {
            ticketquery = ticketquery.eq("ticket_id", ticket_id).maybeSingle();
        } else if(page) {
            const fromRange = (limit * page) - limit;
            const toRange   = (limit * page) - 1;
            ticketquery = ticketquery.range(fromRange, toRange).order("created_at", {ascending: false});
        }
        
        const ticketQueryResponse = await ticketquery;
        
        if (ticketQueryResponse.data) {
            let sendData = {...ticketQueryResponse};
            delete sendData.error;

            res.status(200).json(sendData);
        } else {
            throw ticketQueryResponse.error;
        }
    } catch (error) {
        console.error("error -> ", error);
        res.status(500).json(error?.message || error || "something went wrong please try again");
    }
});

exports.create_ticket = asyncHandler(async (req, res, next) => {
    
    const { name, email, mobile, message, city, state, queryType} = req.body;
    if (name && email && mobile && message && city && state && queryType) {
        try {
            const createTicketResponse = await supabase.from("ticket").insert({name, email, mobile, message, city, state, queryType}).select("*").maybeSingle();
            if (createTicketResponse?.data) {
                res.status(200).json(createTicketResponse?.data);
            } else {
                throw createTicketResponse?.error;
            }
        } catch (error) {
            console.error("error -> ", error);
            res.status(500).json(error?.message || error || "something went wrong please try again");
        }
    } else {
        res.status(500).json("Please send valid body.");
    }
});