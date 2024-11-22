import { Users, Film, Star, Trophy } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About MovieHub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your ultimate destination for discovering, tracking, and discussing the world of cinema.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Our Mission</h2>
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <p className="text-lg leading-relaxed">
            At MovieHub, we believe that great movies have the power to inspire, educate, and bring people together. 
            Our mission is to create a comprehensive and user-friendly platform where movie enthusiasts can:
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
            <li>Discover new and exciting films from around the world</li>
            <li>Keep track of their favorite movies and create watchlists</li>
            <li>Share their thoughts through ratings and reviews</li>
            <li>Connect with other movie lovers in our community</li>
          </ul>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card p-6 rounded-lg text-center">
            <Film className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Extensive Database</h3>
            <p className="text-muted-foreground">
              Access information about thousands of movies, from classics to latest releases
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Reviews & Ratings</h3>
            <p className="text-muted-foreground">
              Share your opinions and read what others think about movies
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-muted-foreground">
              Connect with fellow movie enthusiasts and share recommendations
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Curated Lists</h3>
            <p className="text-muted-foreground">
              Discover top-rated, trending, and upcoming movies
            </p>
          </div>
        </div>
      </div>

      {/* Team/Credits Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Powered By</h2>
        <div className="text-center">
          <p className="text-lg mb-4">
            MovieHub is proudly powered by The Movie Database (TMDB) API
          </p>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg"
              alt="TMDB Logo"
              className="h-8 mx-auto"
            />
          </a>
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <h2 className="text-3xl font-semibold mb-8 text-center">Get in Touch</h2>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-lg mb-4">
            Have questions, suggestions, or just want to say hello? We'd love to hear from you!
          </p>
          <a
            href="mailto:contact@moviehub.com"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
} 