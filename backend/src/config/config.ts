

interface Config {
  port: number;
  nodeEnv: string;
  mongo_url: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongo_url: process.env.MONGO_URL || ""
};

export default config;