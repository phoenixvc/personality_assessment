using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OceanPersonalityApi.Models
{
    public class Assessment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        public double Openness { get; set; }

        public double Conscientiousness { get; set; }

        public double Extraversion { get; set; }

        public double Agreeableness { get; set; }

        public double Neuroticism { get; set; }

        public string? Comments { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}