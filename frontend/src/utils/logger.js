const logger = (functionName) => {
  return function (...args) {
    console.log(`[LOGGER] Called function: ${functionName}`);
    console.log(`[LOGGER] Arguments:`, args);
  };
};

const YOUR_TOKEN_HERE = 

export default logger;

export async function log(stack, level, logPackage, message) {
  try {
    const allowedStacks = ['frontend'];
    const allowedLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
    const allowedPackages = [
      'api',
      'component',
      'hook',
      'page',
      'state',
      'style',
      'auth',
      'config',
      'middleware',
      'utils',
    ];

    if (
      !allowedStacks.includes(stack) ||
      !allowedLevels.includes(level) ||
      !allowedPackages.includes(logPackage)
    ) {
      console.warn('Invalid log values');
      return;
    }

    const evalToken = process.env.REACT_APP_EVAL_TOKEN;
    await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(evalToken ? { 'Authorization': `Bearer ${evalToken}` } : {})
      },
      body: JSON.stringify({
        stack,
        level,
        package: logPackage,
        message,
      }),
    });
  } catch (error) {
    console.error('Logging failed:', error.message);
  }
}
