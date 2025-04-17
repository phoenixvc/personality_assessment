namespace PersonalityFramework.Shared.Models
{
    public class DatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string AssessmentsCollectionName { get; set; } = null!;
        public string UsersCollectionName { get; set; } = null!;
        public string PersonaProfilesCollectionName { get; set; } = null!;
        public string ExperienceSuggestionsCollectionName { get; set; } = null!;
    }
}
