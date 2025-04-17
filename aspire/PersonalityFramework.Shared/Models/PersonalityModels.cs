namespace PersonalityFramework.Shared.Models
{
    public class PersonalityAssessment
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<PersonalityDimension> Dimensions { get; set; } = new List<PersonalityDimension>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class PersonalityDimension
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Score { get; set; }
    }
}

