using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OceanPersonalityApi.Models
{
    public class ExperienceSuggestion
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = null!;

        public string? Description { get; set; }
    }
}