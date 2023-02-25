module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            cust_id: String,
            token: String,
            open_link: Number,
            old_name: String,
            old_phone: String,
            old_address: String,
            new_name: String,
            new_phone: String,
            new_address: String,
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Customer_Report = mongoose.model("customer_report", schema);

    return Customer_Report;
};