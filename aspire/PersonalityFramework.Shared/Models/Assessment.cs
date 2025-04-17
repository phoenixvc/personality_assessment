using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace PersonalityFramework.Shared.Models
{
    public class Assessment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userId")]
        public string UserId { get; set; } = null!;

        [BsonElement("testType")]
        public string TestType { get; set; } = null!;

        [BsonElement("startedDate")]
        public DateTime StartedDate { get; set; }

        [BsonElement("completedDate")]
        public DateTime CompletedDate { get; set; }

        [BsonElement("results")]
        public object Results { get; set; } = null!;

        [BsonElement("score")]
        public object Score { get; set; } = null!;

        // Added property for personality traits
        [BsonElement("personalityTraits")]
        public Dictionary<string, double>? PersonalityTraits { get; set; }
    }
}