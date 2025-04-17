using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace PersonalityFramework.Shared.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Username { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string? Gender { get; set; }

        public string? Location { get; set; }

        [BsonElement("preferences")]
        public Dictionary<string, string>? Preferences { get; set; } = new Dictionary<string, string>();
    }
}