using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PersonalityFramework.Shared.Models
{
    public class UserPreferences
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? UserId { get; set; }

        public string? Theme { get; set; } = "light";

        public bool NotificationsEnabled { get; set; } = true;

        public Dictionary<string, bool> FeatureToggles { get; set; } = new Dictionary<string, bool>();

        public Dictionary<string, string> CustomSettings { get; set; } = new Dictionary<string, string>();
    }
}