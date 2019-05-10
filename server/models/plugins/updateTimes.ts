function updateTimes(schema, options?) {
  schema.add({ createdAt: Date });
  schema.add({ updatedAt: Date });

  schema.index({ createdAt: -1 });
  schema.index({ updatedAt: -1 });

  schema.pre("save", function() {
    this.updatedAt = new Date();
    if (this.isNew) {
      this.createdAt = new Date();
    }
  });
}

export default updateTimes;
