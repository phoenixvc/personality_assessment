using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace PersonalityFramework.Shared.Models
{
    public class ExperienceSuggestion
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = null!;

        public string? Description { get; set; }
        
        // Added properties for personalization
        public List<string> Tags { get; set; } = new List<string>();
        
        public Dictionary<string, double> PersonalityTraitScores { get; set; } = new Dictionary<string, double>();
        
        public string? Category { get; set; }
        
        public int? RecommendationScore { get; set; }
        
        public List<string>? RelatedExperienceIds { get; set; }
    }
}