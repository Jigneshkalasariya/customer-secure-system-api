module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            name: String,
            phone: String,
            address: String
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Customer = mongoose.model("customer", schema);

    return Customer;
};