using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OceanPersonalityApi.Models
{
    public class PersonaProfile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string ProfileName { get; set; } = null!;

        public string? Description { get; set; }

        public Dictionary<string, double> Traits { get; set; } = new Dictionary<string, double>();

        public List<string> ExperienceSuggestionIds { get; set; } = new List<string>();
    }
}